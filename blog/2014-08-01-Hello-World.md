---
title: Hello World!
slug: hello-world
created: 2014-10-10
tags: hakyll, haskell
---

### Hello!

All the cool kids these days are using static site generators. And because I want to start eating at the cool kids table, I've decided that I should to.

Truth be told, I've used something similar in the past. An unholy combination of a lightweight Python web framework with standalone Markdown files, that together produced a "snapshot" that I then uploaded. Once I got off the crack, I decided to look for something that was a little saner.

Unfortunately, I didn't find it. In fact, something worse happened. Along the way I got obsessed with functional purity, and there is nothing more detrimental to sanity.

I decided to try [Hakyll](http://jaspervdj.be/hakyll/), a static site generator written in Haskell, a pure functional programming language. Now, I'm not well-versed in Haskell, but I did have to learn some to be able to configure [Xmonad](http://xmonad.org/) a while back. Why not use it for my blog too? Why not use it for everything? Everything must be pure!

See how deep the rabbit hole goes? My poor mind.

Here is a whirlwind overview of my setup. If you're in bed with static site generation, there is nothing new here. I'm also going to show you how I tackled localization on my blog.

### Setup

But first, that whirlwind of an overview.

Hokay! Simple stuff out of the way first. Every blog post is essentially a plaintext file in Markdown that looks something like this:

``` markdown
---
title: Hello World!
tags: hello, whatever
---

# Hello World!

...etc.

```

The little header at the top separated by the `---` blocks is for metadata. This can be full of all sorts of arbitrary information. Everything else is pretty standard Markdown fare. Hakyll uses [Pandoc](http://freecode.com/projects/pandoc) for parsing Markdown, which means that you have a superset of standard Markdown functionality. In my opinion, it's the [best extension to Markdown](http://johnmacfarlane.net/pandoc/demo/example9/pandocs-markdown.html) out there.

Markdown isn't even necessary. Pandoc is the C-3PO of the parsing world, and will happily take any format you throw at it to spit out HTML. Even Bocce.

So now that we have our collection of blog posts, we should probably do something with it.

``` haskell
main :: IO ()
main = hakyll $ do

    match "images/*" $ do
        route   idRoute
        compile copyFileCompiler

    match "css/*" $ do
        route   idRoute
        compile compressCssCompiler

    match "posts/*" $ do
        route   idRoute
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/base.html" pageCtx
            >>= relativizeUrls
```

Even if you don't understand Haskell, you can *still* work out most of what's happening here.

And of course, templating is also done via Pandoc. For example, all of those Markdown files are crammed into ```$body$``` below.

``` html
  ...
  <body>
    <div id="content">
      $body$
    </div>
  </body>
  ...
```

There are a bunch of other Hakyll-related things that tie everything together, and you can read about them [here](http://jaspervdj.be/hakyll/tutorials/04-compilers.html). This is only meant to be an overview of how stuff works, but perhaps one day I'll write a full tutorial.

...And voilà! An elegant solution that lets me focus on writing instead of fiddling with things. And really, that's all there is to it.

If you're not interested in Haskell or Hakyll, feel free to skip the next section and go outside.


### Multiple (human) languages

Except, like we've established, I'm not exactly sane, so I like creating problems for myself. I have this crazy dream where I will maintain the same blog, *completely localized by hand*, in different languages that I know.

...and I want to know many languages.

Thankfully, I'm only really fluent in two for now: English and Serbian. So, here is how I solved this problem... any case someone else out there thinks this is a great idea. And like every good post that has Haskell in it...!

This blog post is now about monads.

But first, I need to make sure we're all on the same page. Our binary is created like so:

``` bash
    $ ghc --make site.hs
```

And then we take it and build our site:

``` bash
    $ ./site build
```

This outputs our entire site into a folder called `_site` by default. All we have to do then is point a webserver to serve that folder, and we're done. Simple, right? Yes! This is the beauty of static site generation.

However, let's say that we're feeling particularly Serbian, and want to write our next blog post in Serbian. So we do just that, and then run `./site build` and lo and behold, Serbs from all around the world are visiting our blog in droves to read what we wrote. Serbs are cool like that.

And for some, this is an acceptable solution. However, if we want *complete* localization, this means that our interface also needs to be in Serbian too.

No problem. We'll just add a language tag in our blog post:

``` markdown
---
title: Говори српски да те цео свет разуме
language: sr
---
```

And in our templates, we'll display the appropriate language:

``` html
  ...
  <a href="/projects/">
    $if(en)$ Home $endif$
    $if(sr)$ Почетна $endif$
  </a>
  ...
```

Problem solved, right? 

Not quite. When I said *complete* localization, that's exactly what I meant. This approach has a huge problem.

Navigate away from your Serbian post. Why are things still in English? Do you expect your readers to know English and Serbian? That's reather uneasonable, wouldn't you say? Why would you list content alongside other content that's inaccessible to most readers? Why am I asking so many questions? Who knows?

There are a bunch of completeness issues too, like language-specific URLs, tags, and anything else that can be localized. Seeing a tag cloud with keywords in different languages feels ugly. It's painfully clear that what we actually need is a separate site that's in Serbian instead of English. What this means is that we're essentially going to have a separate site for every language, that all share the same template, or look. 

Hard-coding this is pretty ugly. It's much simpler if we just let Hakyll know at runtime what we wanted.

``` bash
    $ ./site build sr    # Build the Serbian version
    $ ./site build en    # Build the English version
``` 

And while that *is* simple, it requires monkeypatching Hakyll, so the next best thing is to set an environment variable before building.

``` bash
    $ export TARGET_LANGUAGE='en'
    $ ./site build
```

After that, all you have to do is wrap your original configuration, and pass the desired language into Hakyll's DSL.

``` haskell
config = defaultConfiguration

main :: IO ()
main = do
    language <- getEnv "TARGET_LANGUAGE"
    hakyllWith config (site language)

site language = 
    ...
```

Make sure your `context`s also understand language. That way, your templates know what to do. Here, I just called that template variable `language`. Creative, I know.

``` haskell
pageCtx :: String -> Context String
pageCtx language = mconcat 
    [ defaultContext
    , constField language language
    ]
```

If you're creating things from scratch, you need to take care of that too. I'm doing that with tags, and a bunch of other things. The most straightforward approach is to have a `Map` with keys, and multiple values for each language that you plan on having. Something like:

``` haskell
translations :: Map.Map String (String, String)
translations = Map.fromList [
    ("language", ("English", "Српски"))
    , ("tag_url", ("tag", "таг"))
    , ("name", ("Aleksandar Mićović", "Александар Мићовић"))
    ]
```

Then, reference them as needed throughout your code.


### A Job Well Done

Admittedly, most normal people don't want to put in this level of effort just so they can write in a different language. Especially in a static environment, where you actually need to put in a bit of work to get something like this functioning just the way you want it to. Or, they just might not care about separation, but I think the results are worth it.

If you've made it this far, thanks for sticking around. You're currently on the English version of my blog ([aleks.rs](http://aleks.rs)). The Serbian version can be found at [алекс.срб](http://алекс.срб). That's right. I took localization *that* far.

I still consider myself a Haskell newbie, but nevertheless, you can find the source for the entire site in the footer below. It needs a bit of refactoring, but it should paint a better picture of what I'm talking about

I'll be writing from time to time here about lots of stuff, though I tend to prefer technical subjects.

Thanks again for reading!
