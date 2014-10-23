---
title: /r/Europe's 2013 Survey Results
slug: europe-subreddit-survey-results-2013
created: 2014-10-12
tags: reddit, europe, statistics
description: Test.
---

<script src="/js/jquery.js"></script>
<script src="/extra/2014-10-12-Europe-Subreddit-Results-2013/europe_survey.js"></script>
<link rel="stylesheet" type="text/css" href="/extra/2014-10-12-Europe-Subreddit-Results-2013/extra.css" />


### Introduction

Every year, the moderators of the European subreddit [/r/europe](http://reddit.com/r/europe) meet high atop a mountain with lightning and evil music, their very own Berlaymont, to hatch a scheme to learn as much as they can about their users. This scheme usually comes in the form of a survey. During the last 2 weeks of 2013, and the first week or so of 2014, such a survey was held.

Naturally, once the moderators ran out of evil music, they released the survey data for everyone to play around with. Over 1800 users from all across Europe participated! User-made maps began springing up everywhere, some of them even [making the news!](http://www.businessinsider.com/maps-a-poll-asked-europeans-which-countries-were-drunkest-hottest-and-had-the-silliest-accent-2013-7). 

However, for the average Joe, much of these insights were, and still remain locked away. Until now, that is!

Below is a tool that allows you to combine questions from the survey, and display them on a heat-map of Europe. If you hover over a country you'll get the result for that country. Enjoy!

### Europe Explorer

<div id="start_app"><a href="#">Click here to start!</a></div>

<div id="questions_added"></div>
<div id="new_question"></div>


<div id="add_question">
  <a href="#">Click here to add a question</a> <em>(total sample: <span id="total"></span>)</em>
</div>

<div class="center"><iframe src="/extra/2014-10-12-Europe-Subreddit-Results-2013/map.svg" width="680" height="520" class="overflow_hidden border_all" scrolling="no" id="map_of_europe"></iframe></div>


### Things learned

 * There are a dispraportionate amount of Poles. The survey must have been passed around in the Polish subreddit.
 * Roughly 92.6% of the subreddit's users are male, which make it [one of the most male-dominated subreddits on Reddit](https://imgur.com/a/ICk20).
 * Even though the vast majority of users were raised in religious homes, they themselves are not religious.
 * Of everyone that can only speak one language, roughly 65% are located in the UK.
 * The vast majority believes that prostitution should be legal.
 * My countrymen don't like me. No one in Serbia voted me their favourite moderator. I DON'T LIKE YOU GUYS EITHER!
 * And lots more! Play around with it, and see what you learn.

A lot of this was also an exercise in manually doing all of this without the help of a mapping library, of which there are tonnes. The next time I do this, I'll definitely be using one. For now, if you encounter any bugs, let me know.

Till the next survey!
