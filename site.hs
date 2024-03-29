--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
import Data.Monoid (mappend, mconcat)
import Hakyll
import System.FilePath.Posix (takeDirectory, takeBaseName,(</>),splitFileName)
import Data.List (isInfixOf)
import System.Environment (getEnv)
import Data.Maybe (fromMaybe)
import Data.Text (replace)
import qualified Data.Map as Map
import Prelude hiding (id,(.))
import Control.Arrow
import Control.Category
import Data.List
import Data.Monoid
import Data.Ord
--------------------------------------------------------------------------------

config = defaultConfiguration

main :: IO ()
main = do
    language <- getEnv "TARGET_LANGUAGE"
    hakyllWith config (site language)

site language =
    let posts_url = getLanguageMapping language "posts_prefix_url"
        y = 2 in do

    -- Copy over static files without much thinking.

    match "images/*" $ do
        route   idRoute
        compile copyFileCompiler

    match "css/*" $ do
        route   idRoute
        compile compressCssCompiler

    match "fonts/*" $ do
        route idRoute
        compile copyFileCompiler

    match "js/*" $ do
        route idRoute
        compile copyFileCompiler

    match "extra/*/*" $ do
        route idRoute
        compile copyFileCompiler

    -- Build the correct tags from posts in the correct language.

    tags <- buildTags (blog_pattern language) (fromCapture "tags/*.html")

    -- Render all pages in every language since language-specific URLs will
    -- point to different versions of the same document.

    match (all_pages language) $ do
        route   $ niceRoute
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/base.html" (pageCtx language)
            >>= relativizeUrls

    -- Blog posts are written in different languages, and live in a different
    -- part of the file hierarchy.

    match (blog_pattern language) $ do
        route $ metadataRoute $ \m ->
            let slug = fromMaybe "" (Map.lookup "slug" m)
            in prefixRouteWithoutFile ((getLanguageMapping language "posts_prefix_url") ++ "/" ++ slug)
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/post.html" (postCtx language tags)
            >>= loadAndApplyTemplate "templates/base.html" (postCtx language tags)
            >>= relativizeUrls

    -- Beyond being renamed, the archive page gathers language-specific posts only.

    match (archive_pattern language) $ do
        route $ niceRoute
        compile $ do
            posts <- recentFirst =<< loadAll (blog_pattern language)
            let archiveCtx = mconcat
                   [ listField "posts" (pageCtx language)(return posts)
                   , pageCtx language
                   ]

            getResourceBody
                >>= applyAsTemplate archiveCtx
                >>= loadAndApplyTemplate "templates/base.html" archiveCtx
                >>= relativizeUrls

    match "pages/index.html" $ do
        route $ customRoute $ (++) (language ++ ".") . drop 6 . toFilePath
        compile $ do
            posts <- recentFirst =<< loadAll (blog_pattern language)
            let indexCtx = mconcat
                    [ listField "posts" (pageCtx language) (return posts)
                    , constField "title" (getLanguageMapping language "home")
                    , pageCtx language
                    , tagCloudCtx tags
                    ]

            getResourceBody
                >>= applyAsTemplate indexCtx
                >>= loadAndApplyTemplate "templates/base.html" indexCtx
                >>= relativizeUrls

    tagsRules tags $ \tag pattern -> do
        let title = tag :: String

        route $ prefixRoute $ getLanguageMapping language "tag_url"
        compile $ do
            posts <- recentFirst =<< loadAll pattern
            let postsCtx = mconcat
                        [ listField "posts" (postCtx language tags) (return posts)
                        , constField "title" title
                        , defaultContext
                        , constField language (getLanguageMapping language "language")
                        ]

            makeItem ""
                >>= loadAndApplyTemplate "templates/tag.html" postsCtx
                >>= loadAndApplyTemplate "templates/base.html" postsCtx
                >>= relativizeUrls

    -- Render Atom feed
    create [(atom_feed_url language)] $ do
        route idRoute
        compile $ do
            posts <- fmap (take 10) . recentFirst =<< loadAll (blog_pattern language)
            renderAtom (myFeedConfiguration language) (postCtx language tags) posts

    -- Compile dem templates.
    match "templates/*" $ compile templateCompiler

--------------------------------------------------------------------------------

postCtx :: String -> Tags -> Context String
postCtx language tags = mconcat
    [ tagsField "tags" tags
    , pageCtx language
    ]

pageCtx :: String -> Context String
pageCtx language = mconcat
    [ defaultContext
    , constField language language
    ]

tagCloudCtx :: Tags -> Context String
tagCloudCtx tags = field "tagcloud" $ \item -> rendered
  where rendered = renderTagCloud 100.0 250.0 tags

niceRoute :: Routes
niceRoute = customRoute createIndexRoute
  where
    createIndexRoute path = takeBaseName (toFilePath path) </> "index.html"

prefixRoute :: String -> Routes
prefixRoute prefix = customRoute addPrefix
  where addPrefix path = prefix ++ "/" ++ takeBaseName (toFilePath path) </> "index.html"

languageRoute :: String-> String -> Routes
languageRoute language url = customRoute newRoute
  where newRoute path = (getLanguageMapping language url) </> "index.html"

prefixRouteWithoutFile :: String -> Routes
prefixRouteWithoutFile prefix = customRoute addPrefix
  where addPrefix path = prefix ++ "/"  </> "index.html"

getLanguageMapping :: String -> String -> String
getLanguageMapping language key
    | language == "en" = fst translated
    | language == "sr" = snd translated
    where
        translated = getTranslation key

getTranslation :: String -> (String, String)
getTranslation identifier = fromMaybe ("a", "a") (Map.lookup identifier translations)

-- TODO: Once I reach Haskell satori, find a way to do this elegantly per language.

translations :: Map.Map String (String, String)
translations = Map.fromList [
    ("language", ("English", "Српски"))
    , ("title", ("Aleksandar Mićović", "Александар Мићовић"))
    , ("tag_url", ("tag", "таг"))
    , ("posts_prefix_url", ("blog", "блог"))
    , ("archive", ("Archive", "Aрхив"))
    , ("home", ("Home", "Почетна"))
    ]

blog_pattern :: String -> Pattern
blog_pattern language
    | language == "en" = "blog/*"
    | language == "sr" = "блог/*"

archive_pattern :: String -> Pattern
archive_pattern language
    | language == "en" = "pages/archive.html"
    | language == "sr" = "pages/архив.html"

all_pages :: String -> Pattern
all_pages language
    | language == "en" = fromList ["pages/about.md", "pages/misc.md"]
    | language == "sr" = fromList ["pages/о_мени.md", "pages/разно.md"]

atom_feed_url :: String -> Identifier
atom_feed_url language
    | language == "en" = "atom.xml"
    | language == "sr" = "aтом.xml"

myFeedConfiguration :: String -> FeedConfiguration
myFeedConfiguration language = FeedConfiguration
    { feedTitle       = getLanguageMapping language "title"
    , feedDescription = if language == "en" then
                            "A feed for my writings, hot off the press."
                        else
                            "Атом за моје постове чим напишем нешто."
    , feedAuthorName  = getLanguageMapping language "title"
    , feedAuthorEmail = "aleks.micovic@gmail.com"
    , feedRoot        = if language == "en" then "http://aleks.rs" else "http://алекс.срб"
    }
