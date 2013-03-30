title: Hello World
summary: I describe this blog's setup.
author: Aleksandar Micovic
type: blog
tags: [python, flask, jinja2]
date: 2013-01-27
updated: 2013-01-27

## Why

I've always had a blog or website in some form or another since 2004, but I always ended up restarting it, after messing it up in some inexplicable way. A series of blog posts apologizing for not posting more or something. I don't know; it was weird. Needless to say, it's definitely my goal to never have to “restart” again. I'd like to keep this going for a very long time, so that in 20 years I will have a treasure trove of thoughts online.

Another reason is that I've always loved writing, and minimalism. The latter especially. So much so that I feel like punching a kitten whenever I see something like this:

![An ad-littered layout.](/static/images/blog/hello-world/ad-littered-website.png)

So with this first post, I vow to always focus on the content!


## The stack

Minimalism on the outside is beautiful, but it's just as pretty on the inside. One of my major gripes with Wordpress was that it was just *big*. So big that it does more than just blogging. This is thanks to the dozens of php files scattered everywhere that you don't really understand—unless you take the time to read them. If you don't care about that sort of thing and just want a blog, I can understand using Wordpress. But god help you should something break, or you'd like a feature that can't be provided with a plugin (and even if it could, you'd have to read the plugin's source to understand that too!).

I have a physical aversion to bloat, which is why I decided to go with a statically generated solution. The advantages are hard to beat:

 * Nothing is easier than a stand-alone HTML file.
 * *Zero* attack vectors. The weakest link is your web server.
 * The entire thing is run by ~100 lines of Python code.

So, the stack? I use a Python micro framework called [Flask](http://flask.pocoo.org/), and extend it with [FrozenFlask](http://packages.python.org/Frozen-Flask/) and [Flask-FlatPages](http://packages.python.org/Flask-FlatPages/). Using Flask by itself isn't ideal as it's meant to hook into a WSGI adapter, and I wanted something that was static. That's where FrozenFlask comes in. By crawling through an instance of your Flask application, it remembers every discoverable URL and the payload that comes with it. It outputs all of this into a separate directory, and when it's done running, you have a static version of your application!

That alone was pretty sweet, but the final step was reading blog posts from files locally. It wouldn't matter how inefficient this had the potential of being since it was only being run once to generate the blog. However, I also wanted Markdown and Pygments to really spice things up, and while I could have implemented this myself, I did find a very thin wrapper called Flask-FlatPages that basically combined all of these things for me.


## Code

First, we import everything and set things up:

    :::python
    from flask import Flask, render_template, url_for
    from flask_flatpages import FlatPages
    from werkzeug.contrib.atom import AtomFeed

    FLATPAGES_EXTENSION = '.md'

    app = Flask(__name__)
    app.config.from_object(__name__)
    pages = FlatPages(app)


To render my home page, I take the last 3 written blog posts to display:

    :::python
    @app.route("/")
    def index():
        blog_posts = [page for page in pages if 'blog' in page.meta['type']]
        posts = sorted(blog_posts, key=lambda a: a.meta['date'], reverse=True)[:3]
        return render_template("index.html", pages=posts)

Posts are written in a flavour of Markdown with all sorts of nice extensions like syntax highlighting.

But perhaps my favourite thing of all is the way pages are rendered. Flask uses Jinja2 templating, and it's just a pleasure to work with. For example, to render the three blog posts I retrieved from above, this is what my HTML looks like:

    :::jinja
    <h2>Newest Posts</h2>
    {% for page in pages %}
        <a href="{{ page.path }}">{{ page.title }}</a>
        <em class="clearBottom">({{ page.date }})</em><br/>
    {% endfor %}

And to top it all off, everything is version controlled with git. You can find a link to the source in the footer. I honestly feel like I'm in some sort of efficiency nirvana. 

It's great.
