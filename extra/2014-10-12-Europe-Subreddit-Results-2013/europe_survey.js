var TOTAL = 0;
var IFRAME = null;
var INNER_IFRAME = null;

var RESPONSES = [];

var COUNTRIES = {
    "Albania": {regions: ["al"]},
    "Andorra": {regions: ["ad"]},
    "Armenia": {regions: ["am"]},
    "Austria": {regions: ["at"]},
    "Belarus": {regions: ["by"]},
    "Belgium": {regions: ["be"]},
    "Bosnia and Herzegovina": {regions:["ba"]},
    "Bulgaria": {regions: ["bg"]},
    "Croatia": {regions: ["hr"]},
    "Cyprus": {regions: ["cy"]},
    "Czech Republic": {regions: ["cz"]},
    "Denmark": {regions: ["dk"]},
    "Estonia": {regions: ["ee"]},
    "Finland": {regions: ["fi"]},
    "France": {regions: ["fr"]},
    "Georgia": {regions: ["ge"]},
    "Germany": {regions: ["de"]},
    "Greece": {regions: ["gr"]},
    "Hungary": {regions: ["hu"]},
    "Iceland": {regions: ["is"]},
    "Ireland": {regions: ["ie"]},
    "Italy": {regions: ["it"]},
    "Latvia": {regions:["lv"]},
    "Liechtenstein": {regions: ["li"]},
    "Lithuania": {regions: ["lt"]},
    "Luxembourg": {regions: ["lu"]},
    "Macedonia": {regions: ["mk"]},
    "Malta": {regions: ["mt"]},
    "Moldova": {regions: ["md"]},
    "Monaco": {regions: ["mc"]},
    "Montenegro": {regions: ["me"]},
    "Netherlands": {regions: ["nl"]},
    "Norway": {regions: ["no"]},
    "Poland": {regions: ["pl"]},
    "Portugal": {regions: ["pt"]},
    "Romania": {regions: ["ro"]},
    "Russia": {regions: ["ru-kgd", "ru-main"]},
    "San Marino": {regions: ["sm"]},
    "Serbia": {regions: ["rs"]},
    "Slovakia": {regions: ["sk"]},
    "Slovenia": {regions: ["si"]},
    "Spain": {regions: ["es"]},
    "Sweden": {regions: ["se"]},
    "Switzerland": {regions: ["ch"]},
    "Turkey": {regions: ["tr"]},
    "Ukraine": {regions: ["ua"]},
    "United Kingdom": {regions: ["gb-nir", "gb-gbn", "im"]}, // Isle of Man will be its own region next survey.
    "Vatican City": {regions: ["va"]}
};

// The list of questions. Also acts as a mapping against the spreadsheet itself.
var QUESTIONS = [
    {
        title: "Age",
        filters: [
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input;})},
            {text: "12 or younger", f: (function(input) { return '12 or under' == input; })},
            {text: "13 to 16", f: (function(input) { return '13 - 16' == input; })},
            {text: "17 to 20", f: (function(input) { return '17 - 20' == input; })},
            {text: "21 to 25", f: (function(input) { return '21 - 25' == input; })},
            {text: "26 to 30", f: (function(input) { return '26 - 30' == input; })},
            {text: "31 to 35", f: (function(input) { return '31 - 35' == input; })},
            {text: "36 to 40", f: (function(input) { return '36 - 40' == input; })},
            {text: "41 to 45", f: (function(input) { return '41 - 45' == input; })},
            {text: "46 to 50", f: (function(input) { return '46 - 50' == input; })},
            {text: "51 to 55", f: (function(input) { return '51 - 55' == input; })},
            {text: "56 to 60", f: (function(input) { return '56 - 60' == input; })},
            {text: "61+", f: (function(input) { return '61 or over' == input; })}
        ]
    },
    {
        title: "Gender",
        filters: [
            {text: "Male", f: (function(input) { return 'Male' == input; })},
            {text: "Female", f: (function(input) { return 'Female' == input; })},
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]        
    },
    {
        title: "Sexual orientation",
        filters: [
            {text: "(1) Exclusively heterosexual", f: (function(input) { return 'Exclusively heterosexual' == input; })},
            {text: "(2) Mostly heterosexual", f: (function(input) { return 'Mostly heterosexual' == input; })},
            {text: "(3) Exclusively homosexual", f: (function(input) { return 'Exclusively homosexual' == input; })},
            {text: "(4) Mostly homosexual", f: (function(input) { return 'Mostly homosexual' == input; })},
            {text: "(5) Bisexual", f: (function(input) { return 'Bisexual' == input; })},
            {text: "(6) Asexual", f: (function(input) { return 'Asexual' == input; })},
            {text: "(7) Non-specific genderqueer", f: (function(input) { return 'Non-specific genderqueer' == input; })},
            {text: "(8) Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })},
            {text: "(1) & (2) Heterosexual", f: (function(input) { return 'Exclusively heterosexual' == input || 'Mostly heterosexual' == input; })},
            {text: "(3) & (4) Homosexual", f: (function(input) { return 'Exclusively homosexual' == input || 'Mostly homosexual' == input; })}
        ]        
    },
    {
        title: "Marrital Status",
        filters: [
            {text: "(1) Single, living with family", f: (function(input) { return 'Single, living with family' == input; })            },
            {text: "(2) Single, living alone / with housemates", f: (function(input) { return 'Single, living alone / with housemates' == input; })},
            {text: "(3) Single, living with partner", f: (function(input) { return 'Single, living with partner' == input; })},
            {text: "(4) Married / Civil partnership, living with partner", f: (function(input) { return 'Married / Civil partnership, living with partner' == input; })},
            {text: "(5) Married / Civil partnership, separated", f: (function(input) { return 'Married / Civil partnership, separated' == input; })},
            {text: "(6) Married / Civil partnership, widowed", f: (function(input) { return 'Married / Civil partnership, widowed' == input; })},
            {text: "(7) Other / Non-traditional partnership", f: (function(input) { return 'Other / Non-traditional partnership' == input; })},
            {text: "(8) Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })},
            {text: "(1) & (2) & (3) Single", f: (function(input) {return 'Single, living with family' == input || 'Single, living alone / with housemates' == input || 'Single, living with partner' == input;})},
            {text: "(4) & (5) & (6) Married (in the past or presently)", f: (function(input) {return 'Married / Civil partnership, living with partner' == input || 'Married / Civil partnership, separated' == input || 'Married / Civil partnership, widowed' == input;})}
        ]        
    },
    {}, // The countries... Not used, except for seeing where responses come from
    {
        title: 'Country of residence',
        filters: []
    },
    {
        title: 'Are you an ethnic minority where you live?',
        filters: [
            {text: "No", f: (function(input) { return 'No' == input; })},
            {text: "Yes", f: (function(input) { return 'Yes' == input; })},
            {text: "Partially / difficult to answer", f: (function(input) { return 'Partially and/or difficult to answer.' == input; })},
            {text: "Prefer not to answer. Sorry.", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'How many languages do you speak fluently?',
        filters: [
            {text: "1", f: (function(input) { return '1' == input; })},
            {text: "2", f: (function(input) { return '2' == input; })},
            {text: "3", f: (function(input) { return '3' == input; })},
            {text: "4", f: (function(input) { return '4' == input; })},
            {text: "5+", f: (function(input) { return '5+' == input; })}
        ]
    },
    {
        title: 'Highest completed education',
        filters: [
            {text: "(1) High school or less", f: (function(input) { return 'High school or less' == input; })},
            {text: "(2) Certificates and/or other accreditation", f: (function(input) { return 'Certificates and/or other accreditation' == input; })},
            {text: "(3) College (A-level, Baccalaureate)", f: (function(input) { return 'College (A-level, Baccalaureate)' == input; })},
            {text: "(4) Bachelor\'s degree", f: (function(input) { return 'Bachelor\'s degree' == input; })},
            {text: "(5) Master\'s degree", f: (function(input) { return 'Master\'s degree' == input; })},
            {text: "(6) Doctorate", f: (function(input) { return 'Doctorate' == input; })},
            {text: "(7) Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })},
            {text: "(4) & (5) & (6) University-level education", f: (function(input) { return 'Doctorate' == input || 'Bachelor\'s degree' == input || 'Master\'s degree' == input; })}
        ]
    },
    {
        title: 'Employment',
        filters: [
            {text: "(1) Full-time student ", f: (function(input) { return 'Full-time student' == input; })},  
            {text: "(2) Part-time student ", f: (function(input) { return 'Part-time student' == input; })},  
            {text: "(3) Part-time student & work", f: (function(input) { return 'Part-time student and part-time employment' == input; })},  
            {text: "(4) Full-time student & work", f: (function(input) { return 'Full-time student and part-time employment' == input; })},  
            {text: "(5) Full-time training", f: (function(input) { return 'Full-time vocational training' == input; })},  
            {text: "(6) Unemployed", f: (function(input) { return 'Unemployed' == input; })},  
            {text: "(7) Employed", f: (function(input) { return 'Employed' == input; })},  
            {text: "(8) Self-employed", f: (function(input) { return 'Self-employed' == input; })},  
            {text: "(9) Part-time work", f: (function(input) { return 'Part-time employment' == input; })},  
            {text: "(10) Full-time parent/carer", f: (function(input) { return 'Full-time parent or carer' == input; })},  
            {text: "(11) Retired", f: (function(input) { return 'Retired' == input; })},  
            {text: "(12) Can't work (medical reasons)", f: (function(input) { return 'I do not work for health/medical reasons.' == input; })},  
            {text: "(13) Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })},
            {text: "(1) & (2) & (3) & (4) Student", f: (function(input) {return 'Full-time student' == input || 'Part-time student' == input || 'Part-time student and part-time employment' == input || 'Full-time student and part-time employment' == input; })}
        ]
    },
    {
        title: 'Religious upbringing',
        filters: [
            {text: "(1) Atheist", f: (function(input) { return 'Atheist or no religious upbringing' == input; })            },
            {text: "(2) Agnostic", f: (function(input) { return 'Agnostic' == input; })},
            {text: "(3) Christian: Roman Catholic", f: (function(input) { return 'Christian: Roman Catholic' == input; })},
            {text: "(4) Christian: Protestant", f: (function(input) { return 'Christian: Protestant (Anglican, Lutheran, Baptist, etc)' == input; })},
            {text: "(5) Christian: Orthodox", f: (function(input) { return 'Christian: Orthodox' == input; })},
            {text: "(6) Christian: Non denominational", f: (function(input) { return 'Christian: Non denominational / Other' == input; })},
            {text: "(7) Islamic: Sunni", f: (function(input) { return 'Islamic: Sunni' == input; })},
            {text: "(8) Islamic: Shia", f: (function(input) { return 'Islamic: Shia' == input; })},
            {text: "(9) Islamic: Sufism", f: (function(input) { return 'Islamic: Sufism' == input; })},
            {text: "(10) Islamic: Non denominational", f: (function(input) { return 'Islamic: Non denomination / Other' == input; })},
            {text: "(11) Jewish: Orthodox", f: (function(input) { return 'Jewish: Orthodox' == input; })},
            {text: "(12) Jewish: Conservative", f: (function(input) { return 'Jewish: Conservative' == input; })},
            {text: "(13) Jewish: Reform", f: (function(input) { return 'Jewish: Reform' == input; })},
            {text: "(14) Jewish: Orthodox", f: (function(input) { return 'Jewish: Orthodox' == input; })},
            {text: "(15) Jewish: Other", f: (function(input) { return 'Jewish: Other' == input; })},
            {text: "(16) Baha'i", f: (function(input) { return 'Baha\'i' == input; })},
            {text: "(17) Buddhism: Theravada", f: (function(input) { return 'Buddhism: Theravada' == input; })},
            {text: "(18) Buddhism: Mahayana", f: (function(input) { return 'Buddhism: Mahayana' == input; })},
            {text: "(19) Buddhism: Other", f: (function(input) { return 'Buddhism: Other' == input; })},
            {text: "(20) Hinduism: Smartism", f: (function(input) { return 'Hinduism: Smartism' == input; })},
            {text: "(21) Hinduism: Vaishnavism", f: (function(input) { return 'Hinduism: Vaishnavism' == input; })},
            {text: "(22) Hinduism: Other", f: (function(input) { return 'Hinduism: Other' == input; })},
            {text: "(23) Sikhism", f: (function(input) { return 'Sikhism' == input; })},
            {text: "(24) Shinto", f: (function(input) { return 'Shinto' == input; })},
            {text: "(25) Confucianism", f: (function(input) { return 'Confucianism' == input; })},
            {text: "(26) Taoism", f: (function(input) { return 'Taoism' == input; })},
            {text: "(27) Taoism", f: (function(input) { return 'Taoism' == input; })},
            {text: "(28) Zoroastrianism", f: (function(input) { return 'Zoroastrianism' == input; })},
            {text: "(29) Rastafarianism", f: (function(input) { return 'Rastafarianism' == input; })},
            {text: "(30) Neopagan / Wicca / Druidic", f: (function(input) { return 'Neopagan / Wicca / Druidic' == input; })},
            {text: "(31) Spiritualist", f: (function(input) { return 'Spiritualist' == input; })},
            {text: "(32) Animism / Indigenous", f: (function(input) { return 'Animism / Indigenous' == input; })},
            {text: "(33) Mixed religious beliefs", f: (function(input) { return 'Mixed religious beliefs' == input; })},
            {text: "(34) Other", f: (function(input) { return 'Other' == input; })},
            {text: "(35) Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })},
            {text: "(3) & (4) & (5) & (6) Christian", f: (function(input) { return 'Christian: Roman Catholic' == input || 'Christian: Protestant (Anglican, Lutheran, Baptist, etc)' == input || 'Christian: Orthodox' == input || 'Christian: Non denominational / Other' == input; })},
            {text: "(7) & (8) & (9) & (10) Muslim", f: (function(input) { return 'Islamic: Sunni' == input || 'Islamic: Shia' == input || 'Islamic: Sufism' == input || 'Islamic: Non denomination / Other' == input; })},
            {text: "(11) & (12) & (13) & (14) & (15) Jewish", f: (function(input) { return 'Jewish: Orthodox' == input || 'Jewish: Conservative' == input || 'Jewish: Reform' == input || 'Jewish: Orthodox' == input || 'Jewish: Other' == input; })}
        ]
    },
    {
        title: 'Religious belief',
        filters: []
    },
    {
        title: 'Strength of belief',
        filters: [
            {text: "(1) Very Important", f: (function(input) { return '5' == input; })},
            {text: "(2) Somewhat important", f: (function(input) { return '4' == input; })},
            {text: "(3) Neutral", f: (function(input) { return '3' == input; })},
            {text: "(4) Somewhat unimportant", f: (function(input) { return '2' == input; })},
            {text: "(5) Negligible", f: (function(input) { return '1' == input; })},
            {text: "(1) & (2) Important", f: (function(input) { return '5' == input || '4' == input; })},
            {text: "(4) & (5) Not Important", f: (function(input) { return '1' == input || '2' == input; })}
        ]
    },
    {
        title: 'User of illegal drugs in own country',
        filters: [
            {text: "No. Never.", f: (function(input) { return 'No. Never.' == input; })},
            {text: "Not anymore, but did in the past.", f: (function(input) { return 'Not anymore, but I did in the past.' == input; })},
            {text: "Yes.", f: (function(input) { return 'Yes.' == input; })},
            {text: "Prefer not to answer. Sorry.", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'View on cannabis',
        filters: [
            {text: "Already legalised or decriminalised in own country, supports it.", f: (function(input) { return 'Is currently legal or decriminalized in my country. I support it.' == input; })},
            {text: "Fully support legalisation", f: (function(input) { return 'I fully support legalization.' == input; })},
            {text: "Support decriminalisation for personal use, but not legalisation", f: (function(input) { return 'I support decriminalization for personal use, but not legalization.' == input; })},
            {text: "Indifferent and/or don't care.", f: (function(input) { return 'I\'m indifferent and/or don\'t care.' == input; })},
            {text: "Do not support decriminalization or legalisation.", f: (function(input) { return 'I do not support decriminalization or legalization.' == input; })},
            {text: "Already legal or decriminalized in own country, opposes it.", f: (function(input) { return 'Is currently legal or decriminalized in my country. I oppose it.' == input; })},
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'View on psychoactives/psychedelics',
        filters: []
    },
    {
        title: 'View on MDMA & stimulants',
        filters: []
    },
    {
        title: 'View on heroin, cocaine, "hard drugs", etc.',
        filters: []
    },
    {
        title: 'Level of pirating',
        filters: [
            {text: "Hardcore pirate.", f: (function(input) { return 'I\'m a hardcore pirate (private trackers, Usenet subscription, seedboxes, etc)' == input; })},
            {text: "Pirates digital media heavily.", f: (function(input) { return 'I pirate digital media heavily.' == input; })},
            {text: "Pirates digital media regularly.", f: (function(input) { return 'I pirate digital media regularly.' == input; })},
            {text: "Occasionally downloads illegally.", f: (function(input) { return 'I occasionally download illegally.' == input; })},
            {text: "Rarely download illegally.", f: (function(input) { return 'I rarely download illegally.' == input; })},
            {text: "Have never downloaded anything illegally.", f: (function(input) { return 'I have never downloaded anything illegally.' == input; })},
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'Purchasing digital media through legal mediums',
        filters: [
            {text: "Yes", f: (function(input) { return 'Yes' == input; })},
            {text: "Sometimes", f: (function(input) { return 'Sometimes' == input; })},
            {text: "Rarely", f: (function(input) { return 'Rarely' == input; })},
            {text: "Never", f: (function(input) { return 'Never' == input; })},
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'Sharing of digital media should be legal',
        filters: []
    },
    {
        title: 'Sharing of digital media damages the industry',
        filters: []
    },
    {
        title: 'Homosexual behaviour is natural',
        filters: []
    },
    {
        title: 'Homosexual behaviour is moral',
        filters: []
    },
    {
        title: 'Homosexual behaviour should be legal',
        filters: []
    },
    {
        title: 'Gay marriage should be legal',
        filters: []
    },
    {
        title: 'Humans should aspire to life-long monogamous relationships',
        filters: []
    },
    {
        title: 'Age of consent should be same for heterosexual and homosexual sex',
        filters: []
    },
    {
        title: 'Prostitution should be legal',
        filters: []
    },
    {
        title: 'Ephebophilia should be treated differently from paedophilia ',
        filters: []
    },
    {
        title: 'Age of consent in country is...',
        filters: [
            {text: "Just right", f: (function(input) { return 'Just right' == input; })},
            {text: "Too high", f: (function(input) { return 'Too high' == input; })},
            {text: "Too low", f: (function(input) { return 'Too low' == input; })},
            {text: "No opinion", f: (function(input) { return 'No opinion.' == input; })},
            {text: "Undisclosed", f: (function(input) { return 'Prefer not to answer. Sorry.' == input; })}
        ]
    },
    {
        title: 'All ethnicities should be treated equally',
        filters: []
    },
    {
        title: 'It is possible to predict someone\'s behaviour based on ethnicity',
        filters: []
    },
    {
        title: 'Racial slurs are completely unacceptable in public',
        filters: []
    },
    {
        title: 'Racial slurs are completely unacceptable in private/between friends',
        filters: []
    },
    {
        title: 'All religions should be treated with respect',
        filters: []
    },
    {
        title: 'Views on Romani/Gypsy people are generally...',
        filters: []
    },
    {
        title: 'Feelings on the EU are generally',
        filters: []
    },
    {
        title: 'Feelings on the €uro are...',
        filters: []
    },
    {
        title: 'Feelings about further EU integration are...',
        filters: []
    },
    {
        title: 'Feelings about government welfare are...',
        filters: []
    },
    {
        title: 'Feelings about American influence in Europe are...',
        filters: []
    },
    {
        title: 'Feelings about America as a superpower are...',
        filters: []
    },
    {
        title: 'Feelings about Chinese influence in Europe are...',
        filters: []
    },
    {
        title: 'Feelings about China as a future superpower are...',
        filters: []
    },
    {
        title: 'Feelings about migration from rest of EU to my country are...',
        filters: []
    },
    {
        title: 'Feelings about immigration from outside of the EU to my country are...',
        filters: []
    },
    {
        title: 'The EU should have a shared armed forces',
        filters: []
    },
    {
        title: 'The EU should maintain its own military',
        filters: []
    },
    {
        title: 'European nations should maintain nuclear capability',
        filters: []
    },
    {
        title: 'There should be a right to anonymity on the internet',
        filters: []
    },
    {
        title: 'Government surveillance is a growing problem in Europe',
        filters: []
    },
    {
        title: 'Feelings about PRISM and/or the NSA',
        filters: [
            {text: "Already have and/or from now on encrypting everything I do online.", f: (function(input) { return 'I already have and/or from now on encrypting everything I do online.' == input; })},
            {text: "Going to be more conscientious of the services I use online.", f: (function(input) { return 'I\'m going to be more conscientious of the services I use and the things I do online.' == input; })},
            {text: "Going to continue doing what I've always been doing.", f: (function(input) { return 'I\'m going to continue doing what I\'ve always been doing.' == input; })},
            {text: "Don't know and/or care.", f: (function(input) { return 'I don\'t know and/or care.' == input; })} 
        ]
    },
    {
        title: 'Feelings about Scotland\'s independence?',
        filters: [
            {text: "Support independence.", f: (function(input) { return 'I support independence.' == input; })},
            {text: "Oppose independence", f: (function(input) { return 'I do not support independence.' == input; })},
            {text: "I don't know and/or care.", f: (function(input) { return 'I don\'t know and/or care.' == input; })}
        ]
    },
    {
        title: 'Is Turkey a part of Europe?',
        filters: [
            {text: "Yes.", f: (function(input) { return 'Yes.' == input; })},
            {text: "No.", f: (function(input) { return 'No.' == input; })},
            {text: "I don't know and/or care.", f: (function(input) { return 'I don\'t know and/or care.' == input; })}
        ]
    },
    {
        title: 'Would you support Turkey in the EU?', 
        filters: [
            {text: "Yes.", f: (function(input) { return 'Yes.' == input; })},
            {text: "No.", f: (function(input) { return 'No.' == input; })},
            {text: "I don't know and/or care.", f: (function(input) { return 'I don\'t know and/or care.' == input; })}
        ]
    },
    {
        title: 'Current immigration policies need to be rethought',
        filters: []
    },
    {
        title: 'Activity level on /r/europe',
        filters: [
            {text: "(1) Very active: 5+ hours every week", f: (function(input) { return 'Very Active: 5+ hours every week' == input; })},
            {text: "(2) Active: 1+ hour every week", f: (function(input) { return 'Active: 1+ hour every week' == input; })},
            {text: "(3) Regular: A few minutes here and there", f: (function(input) { return 'Regular: A few minutes here and there' == input; })},
            {text: "(4) Not active: Visit sometimes, if ever", f: (function(input) { return 'Not active: You visit sometimes, if ever' == input; })},
            {text: "(1) & (2) & (3) Active", f: (function(input) { return 'Very Active: 5+ hours every week' == input || 'Active: 1+ hour every week' == input || 'Regular: A few minutes here and there' == input;})}
        ]
    },
    {
        title: 'Activity level on own country subreddit',
        filters: [
            {text: "Visit /r/europe more often", f: (function(input) { return 'Yes, I visit /r/europe more often.' == input; })},
            {text: "About the same as /r/europe", f: (function(input) { return 'Eh, about the same.' == input; })},
            {text: "Visit country's subreddit more often than /r/europe", f: (function(input) { return 'No, I visit my country\'s subreddit more often.' == input; })},
            {text: "Doesn't know", f: (function(input) { return 'I don\'t know.' == input; })}
        ]
    },
    {
        title: 'The content submitted to /r/europe is...',
        filters: []
    },
    {
        title: 'The comment threads on /r/europe are...',
        filters: []
    },
    {
        title: 'The moderators on /r/europe are...',
        filters: []
    },
    {
        title: 'The /r/europe community is...',
        filters: []
    },
    {
        title: 'Racism is a problem in /r/europe...',
        filters: []
    },
    {
        title: 'Racism should result in an immediate ban from /r/europe',
        filters: []
    },
    {
        title: 'Feelings about Eurovision',
        filters: []
    },
    {
        title: 'The European country with the silliest accent',
        filters: []
    },
    {
        title: 'The European country with the the most attractive citizens',
        filters: []
    },
    {
        title: 'The European country that can drink the most',
        filters: []
    },
    {
        title: 'The European country that\'s your favourite, apart from your own',
        filters: []
    },
    {
        title: 'The European country that\'s your least favourite',
        filters: []
    },
    {
        title: 'The European country that would give you the biggest culture shock',
        filters: []
    },
    {
        title: 'The European country with the worst sense of humour',
        filters: [
            {text: "Germany", f: (function(input) { return 'Germany' == input; })},
            {text: "I am German and do not find this funny.", f: (function(input) { return 'I am German and do not find this funny.' == input; })}
        ]
    },
    {
        title: 'The European country that loves to complain',
        filters: [
            {text: "United Kingdom", f: (function(input) { return 'United Kingdom' == input; })},
            {text: "United Kingdom, and I fart in their general direction.", f: (function(input) { return 'United Kingdom, and I fart in their general direction.' == input; })},
            {text: "I am British and this question does not sit well with me!", f: (function(input) { return 'I am British and this question does not sit well with me!' == input; })}
        ]
    },
    {
        title: 'Favourite moderator',
        filters: [
            {text: "kitestramuort", f: (function(input) { return 'kitestramuort' == input; })},
            {text: "Raerth", f: (function(input) { return 'Raerth' == input; })},
            {text: "TheSkyNet", f: (function(input) { return 'TheSkyNet' == input; })},
            {text: "SpAn12", f: (function(input) { return 'SpAn12' == input; })},
            {text: "gschizas", f: (function(input) { return 'gschizas' == input; })},
            {text: "Bezbojnicul", f: (function(input) { return 'Bezbojnicul' == input; })},
            {text: "davidreiss666", f: (function(input) { return 'davidreiss666' == input; })},
            {text: "Skuld", f: (function(input) { return 'Skuld' == input; })},
            {text: "JB_UK", f: (function(input) { return 'JB_UK' == input; })},
            {text: "metaleks", f: (function(input) { return 'metaleks' == input; })},
            {text: "Aschebescher", f: (function(input) { return 'Aschebescher' == input; })},
            {text: "They're all bad and they should feel bad.", f: (function(input) { return 'They\'re all bad and they should feel bad.' == input; })}
        ]
    }
];

// Both of these have a 1:1 correspondance.

var QUESTIONS_ADDED = [];
var FILTERS_ADDED = [] ;

function prepare_countries() {
    // Initialize COUNTRIES
    for (var country in COUNTRIES) {
        COUNTRIES[country].total = 0;
        COUNTRIES[country].percentage = 0;
        COUNTRIES[country].colour = "#f0f0f0";
    }

    $.get("/extra/2014-10-12-Europe-Subreddit-Results-2013/europe_survey.csv", function(csv) {
        var responses = csv.split('\n');

        // Go through every response.
        for (var i=0; i<responses.length; i++) {
            var response = responses[i].replace(/"/g, "").split(/\t/);
            
            if (COUNTRIES[response[4]] == undefined) {
                // If you ain't European bud, we ain't graphin' you.
                continue;
            }

            // Go through every question in the current response.
            RESPONSES.push(response);
        }

        update_map(false);

        // Copy over the religious list.

        QUESTIONS[11].filters = QUESTIONS[10].filters;

        // And the drug options.

        QUESTIONS[15].filters = QUESTIONS[14].filters;
        QUESTIONS[16].filters = QUESTIONS[14].filters;
        QUESTIONS[17].filters = QUESTIONS[14].filters;

        // Update the fields that list countries in our master list of questions.
        
        var questions = [5, 66, 67, 68, 69, 70, 71];
        
        var escape_closure = function(country) {
            return (function(input) { return input == country});
        }

        for (var i=0; i<questions.length; i++) {
            for (var country in COUNTRIES) {
                QUESTIONS[questions[i]].filters.push({
                    text: country,
                    f: escape_closure(country)
                });
            }
        }

        // Update the fields that list questions from a scale of 1 - 5.

        var agree_format = [
            { text: "(1) Strongly agree", f: (function(input) { return '5' == input; })},
            { text: "(2) Somewhat agree", f: (function(input) { return '4' == input; })},
            { text: "(3) Neutral", f: (function(input) { return '3' == input; })},
            { text: "(4) Somewhat disagree", f: (function(input) { return '2' == input; })},
            { text: "(5) Strongly disagree", f: (function(input) { return '1' == input; })},
            { text: "(1) & (2) Agree", f: (function(input) { return '5' == input || '4' == input; })},
            { text: "(4) & (5) Disagree", f: (function(input) { return '1' == input || '2' == input; })}
        ];

        var views_format = [
            { text: "(1) Very positive", f: (function(input) { return '5' == input; })},
            { text: "(2) Somewhat positive", f: (function(input) { return '4' == input; })},
            { text: "(3) Neutral", f: (function(input) { return '3' == input; })},
            { text: "(4) Somewhat negative", f: (function(input) { return '2' == input; })},
            { text: "(5) Very negative", f: (function(input) { return '1' == input; })},
            { text: "(1) & (2) Positive", f: (function(input) { return '5' == input || '4' == input; })},
            { text: "(4) & (5) Negative", f: (function(input) { return '1' == input || '2' == input; })}
        ];

        var like_format = [
            { text: "(1) Very good", f: (function(input) { return '5' == input; })},
            { text: "(2) Somewhat good", f: (function(input) { return '4' == input; })},
            { text: "(3) Neutral", f: (function(input) { return '3' == input; })},
            { text: "(4) Somewhat bad", f: (function(input) { return '2' == input; })},
            { text: "(5) Really bad", f: (function(input) { return '1' == input; })},
            { text: "(1) & (2) Good", f: (function(input) { return '5' == input || '4' == input; })},
            { text: "(4) & (5) Bad", f: (function(input) { return '1' == input || '2' == input; })}
        ];
        
        questions = [
            {question_id: 20, filters: agree_format},
            {question_id: 21, filters: agree_format},
            {question_id: 22, filters: agree_format},
            {question_id: 23, filters: agree_format},
            {question_id: 24, filters: agree_format},
            {question_id: 25, filters: agree_format},
            {question_id: 26, filters: agree_format},
            {question_id: 27, filters: agree_format},
            {question_id: 28, filters: agree_format},
            {question_id: 29, filters: agree_format},
            {question_id: 31, filters: agree_format},
            {question_id: 32, filters: agree_format},
            {question_id: 33, filters: agree_format},
            {question_id: 34, filters: agree_format},
            {question_id: 35, filters: agree_format},
            {question_id: 36, filters: agree_format},
            {question_id: 37, filters: views_format},
            {question_id: 38, filters: views_format},
            {question_id: 39, filters: views_format},
            {question_id: 40, filters: views_format},
            {question_id: 41, filters: views_format},
            {question_id: 42, filters: views_format},
            {question_id: 43, filters: views_format},
            {question_id: 44, filters: views_format},
            {question_id: 45, filters: views_format},
            {question_id: 46, filters: views_format},
            {question_id: 47, filters: agree_format},
            {question_id: 48, filters: agree_format},
            {question_id: 49, filters: agree_format},
            {question_id: 50, filters: agree_format},
            {question_id: 51, filters: agree_format},
            {question_id: 56, filters: agree_format},
            {question_id: 59, filters: like_format},
            {question_id: 60, filters: like_format},
            {question_id: 61, filters: like_format},
            {question_id: 62, filters: like_format},
            {question_id: 63, filters: agree_format},
            {question_id: 64, filters: agree_format},
            {question_id: 65, filters: views_format}
        ];

        for (var i=0; i<questions.length; i++) {
            QUESTIONS[questions[i].question_id].filters = questions[i].filters;
        }
    });
}

function build_global_select_box() {
    var select_box = "<select id='main_question'>";

    for (var i=0; i<QUESTIONS.length; i++) {
        if (($.inArray(i, QUESTIONS_ADDED) == -1) && QUESTIONS[i].title) {
            select_box += "<option value='" + i + "'>" + QUESTIONS[i].title + "</option>";
        }
    }

    select_box += "</select>";

    return select_box;
}

function build_local_select_box(id) {
    var select_box = "<select id='filtered_question'>";

    for (var i=0; i<QUESTIONS[id].filters.length; i++) {
        select_box += "<option value='" + i + "'>"  + QUESTIONS[id].filters[i].text + "</option>";
    }

    select_box += "</select>";

    return select_box;
}

function add_question() { 
    // If we've added all the questions, don't prompt another select box. Also, since we're
    // mapping against the country field, make sure to not count that as a question, so 
    // subtract one from the total number of questions.


    if (QUESTIONS_ADDED.length == (QUESTIONS.length- 1)) {
        alert("You can't make any more queries! :(");
        return false;
    }

    // Build, display, and select the first option in the QUESTIONS select box.
    var global_select_box = build_global_select_box();
    $("#new_question").html(global_select_box);
    $("#main_question option:first").attr('selected', 'selected');
    var question_id = parseInt($("#main_question option:selected").val());

    // Build, display, and select the first option in the FILTERS select box.
    var filters_select_box = build_local_select_box(question_id);
    $("#new_question").append(filters_select_box);
    $("#filtered_question option:first").attr('selected', 'selected');

    // Add a finished link to clear the current question from being added.
    var finished_link = "<a href='#' id='finished_question'>Add filter!</a>";
    $("#new_question").append(finished_link);

    // Update the map with everything in QUESTIONS/FILTERS_ADDED, and also include
    // the current selected question and filter.

    var question_id = parseInt($("#main_question option:selected").val());
    var filter_id = parseInt($("#filtered_question option:selected").val());

    update_map({
        question_id: question_id, 
        filter_id: filter_id
    });

    update_handlers();
}

function update_handlers() {
    // Removing already added questions.
    $(".remove_question").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).attr('id').split("remove_")[1];
        var location_in_array = QUESTIONS_ADDED.indexOf(parseInt(id));

        console.log(e);

        if (~location_in_array) {
            QUESTIONS_ADDED.splice(location_in_array, 1);
            FILTERS_ADDED.splice(location_in_array, 1);

            $("#question_" + id).remove();
            update_map(false);
        }
    });

    // Update the map on any filter change.
    $("#filtered_question").change(function() {
        var question_id = parseInt($("#main_question option:selected").val());
        var filter_id = parseInt($("#filtered_question option:selected").val());

        update_map({
            question_id: question_id, 
            filter_id: filter_id
        });
    })

    // Update the map on any question change.
    $("#main_question").change(function() {
        var finished_link = " <a href='#' id='finished_question'>Add filter!</a>";
        var question_id = parseInt($("#main_question option:selected").val());
        var filters_select_box = build_local_select_box(question_id);

        $("#filtered_question").remove();
        $("#finished_question").remove();
        $("#new_question").append(filters_select_box);
        $("#new_question").append(finished_link);
        $("#filtered_question option:first").attr('selected', 'selected');

        update_map({
            question_id: question_id, 
            filter_id: 0
        });

        update_handlers();
    });

    // Add the question.
    $("#finished_question").click(function(e) {
        e.preventDefault();
        var question_id = parseInt($("#main_question option:selected").val());
        var filter_id = parseInt($("#filtered_question option:selected").val());
        
        QUESTIONS_ADDED.push(question_id);
        FILTERS_ADDED.push(filter_id);

        var remove_question = "<em><a href='#' class='remove_question' id='remove_" + question_id + "'>(Remove)</a></em>";
        var added_question = "<p id='question_" + question_id + "' class='query'><strong>Query — " + QUESTIONS[question_id].title + 
                             ":</strong> " + QUESTIONS[question_id].filters[filter_id].text + " " + remove_question + "</p>";
        $("#questions_added").append(added_question);
        $("#new_question").html('');

        // We need to update the map any case the user deletes an already-established question,
        // and then clicks the "add" button to add this current question.

        update_map(false);

        update_handlers();
    });
}

function update_map(current_query) {
    // Because we want to update the map in real-time as a user selects a potential question,
    // make sure to potentially include the question being played around with in addition to
    // everything else that has already been selected.
    
    var questions_selected = [];
    questions_selected.push.apply(questions_selected, QUESTIONS_ADDED);

    var filters_selected = [];
    filters_selected.push.apply(filters_selected, FILTERS_ADDED);

    if (current_query) {
        questions_selected.push(current_query.question_id);
        filters_selected.push(current_query.filter_id);
    }

    // Reset countries and counts.

    for (var country in COUNTRIES) {
        COUNTRIES[country].total = 0;
        COUNTRIES[country].percentage = 0;
        COUNTRIES[country].colour = "#f0f0f0"
    }

    TOTAL = 0;

    // If there are no questions selected, then reset the map.

    if (!questions_selected.length) {
        for (var i=0; i<RESPONSES.length; i++) {
            COUNTRIES[RESPONSES[i][4]].total++;
            TOTAL++;
        }

        $("#total").html(TOTAL);
        colour_countries();
        return false;
    }

    // Now that we have our final list of questions, build the results!

    for (var i=0; i<RESPONSES.length; i++) {
        var add = true;
        var response = RESPONSES[i];

        for (var j=0; j<questions_selected.length; j++) {
            var current_question = questions_selected[j];
            var current_filter = filters_selected[j];

            if (!QUESTIONS[current_question].filters[current_filter].f(response[current_question])) {
                add = false;
                break;
            }
        }

        if (add) {
            COUNTRIES[response[4]].total++;
            TOTAL++;
        }
    }

    $("#total").html(TOTAL);
    colour_countries();
}

function darken_colour(colour, shade) {
    var colour_int = parseInt(colour.substring(1),16);
     
    var red = (colour_int & 0xFF0000) >> 16;
    var green = (colour_int & 0x00FF00) >> 8;
    var blue = (colour_int & 0x0000FF) >> 0;
    
    red = red + Math.floor((shade / 255) * red);
    green = green + Math.floor((shade / 255) * green);
    blue = blue + Math.floor((shade / 255) * blue);
           
    var new_colour_int = (red << 16) + (green << 8) + (blue);
    var new_colour = "#" + new_colour_int.toString(16);

    if (new_colour.indexOf("-") == -1) {
        return new_colour;
    } else {
        return "#000000"
    }
}

function colour_countries() {
    base_colour = "#FFCCCC";
    var iframe = document.getElementById('map_of_europe');
    var inner_iframe = iframe.contentDocument || iframe.contentWindow.document;

    for (var country in COUNTRIES) {
        if (COUNTRIES[country].total == 0){
            COUNTRIES[country].percentage = 0;
            COUNTRIES[country].colour = "#f0f0f0";
        } else {
            var percentage = ((COUNTRIES[country].total / TOTAL) * 100).toFixed(2);
            COUNTRIES[country].percentage = percentage; // Round to 2.
            COUNTRIES[country].colour = darken_colour(base_colour, -parseInt(percentage) * 10); // A simple scalar for greater variance.
        }

        // We can finally colour in the countries now.
        for (var i=0; i<COUNTRIES[country].regions.length; i++) {
            inner_iframe.getElementById(COUNTRIES[country].regions[i]).style.fill = COUNTRIES[country].colour;
        }
    }
}

function hover_stats(country, r) {
    var region = COUNTRIES[country].regions[r];
    var box = "<div id='hover'></div>";

    // Move da div!
    INNER_IFRAME.getElementById(region).onmousemove = function(event) {
        var x_offset = $("#hover").width() / 2;
        var y_offset = $("#hover").height() * 1.5;

        $("#hover").css({
            top: $('iframe').offset().top + event.clientY - y_offset,
            left: $('iframe').offset().left + event.clientX - x_offset
        });
    }

    // Create element on entering a country.
    INNER_IFRAME.getElementById(region).onmouseover = function(event) {
        $("body").append(box);
        $("#hover").css({
            top: $('iframe').offset().top + event.clientY,
            left: event.screenX
        });
        $("#hover").html("<strong class='center'>" + country + "</strong><br/>" +
                         "Percentage: " + COUNTRIES[country].percentage + "%<br/>" + 
                         "Sample: " + COUNTRIES[country].total);
    }

    // Destroy element on leaving a country.
    INNER_IFRAME.getElementById(region).onmouseout = function(event) {
        $("#hover").remove();
    }
}

$(document).ready(function() {
    $("#start_app").click(function(e) {
        e.preventDefault();
        $(this).hide();

        IFRAME = document.getElementById('map_of_europe');
        INNER_IFRAME = IFRAME.contentDocument || IFRAME.contentWindow.document;
        prepare_countries();

        // Bind hover to all regions.
        for (var country in COUNTRIES) {
            for (var r=0; r<COUNTRIES[country].regions.length; r++) {
                hover_stats(country, r);
            }
        }

        $("#add_question").show();
        $("#add_question > a").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            add_question();
        });
    });
});
