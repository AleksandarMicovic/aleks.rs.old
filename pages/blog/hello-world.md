title: Hello World
summary: I describe this blog's setup.
author: Aleksandar Micovic
type: content
tags: [python, flask, jinja2]
date: 2013-01-27
updated: 2014-01-18

### The stack

Minimalism on the outside is beautiful, but it's just as pretty on the inside. One of my major gripes with Wordpress (my previous blogging platform) was that it was just *big*. So big that it did more than just blogging. If you don't care about that sort of thing and just want a blog, I can understand using Wordpress. However, I've always preferred minimalistic solutions instead, so here we are!

More specifically, I've decided to go with a statically generated solution. The advantages are hard to beat:

 * Nothing is easier than a stand-alone HTML file.
 * *Zero* attack vectors. The weakest link is your web server.
 * The entire thing is run by ~100 lines of Python code.

So, the stack? I use a Python micro framework called [Flask](http://flask.pocoo.org/), and extend it with tiny plugins to generate something static. That's right, I'm using a web framework like Rails, Django, and what-have-you to generate a stand-alone website. There are static website-generating solutions out there like the excellent [Jekyll](http://jekyllrb.com/), but my solution is more explicit, easier to extend, and *way* more flexible considering I get all the benefits of an actual web framework.

Using Flask by itself isn't ideal as it's meant to hook into a WSGI adapter. That's where [FrozenFlask](http://pythonhosted.org/Frozen-Flask/) comes in. By crawling through an instance of any Flask application, it keeps track of every discoverable URL and the payload that comes with it. It outputs all of this into a separate directory, and when it's done running, you have a static version of your application!

That alone was pretty sweet, but the final step was reading blog posts from files locally. It wouldn't matter how inefficient this had the potential of being since it was only being run once to generate the blog. However, I also wanted Markdown and Pygments to really spice things up, and while I could have implemented this myself with simple file IO, I did find a very thin wrapper called [Flask-FlatPages](http://pythonhosted.org/Flask-FlatPages/) that basically combined all of these things for me.


### Code

The first thing you want to do is set the file extension of all your content, and customize the Markdown extensions you want to use.

    :::python
    FLATPAGES_EXTENSION = '.md'
    FLATPAGES_MARKDOWN_EXTENSIONS = ['codehilite(guess_lang=False)', 
                                     'headerid',
                                     'tables']

If you've ever worked with any web framework, everything else is what you would normally expect. For example, my home page:

    :::python
    @app.route("/")
        def index():
        posts = [page for page in pages if 'content' == page.meta['type']]
        newest = sorted(posts, key=lambda a: a.meta['date'], reverse=True)[:15]
        return render_template("index.html", pages=newest)

Flask uses Jinja2 templating, and it's just a pleasure to work with. For example, to render the blog posts I retrieved from above, this is what my HTML looks like:

    :::jinja
    <h3>Recent Posts</h3>
    
    <ul>
    {% for page in pages %}
       <li>
           <a href="{{ url_for('page', path=page.path) }}">{{ page.title }}</a>
           <em class="small">({{ page.date }})</em>
       </li>
    {% endfor %}
    </ul>

And to top it all off, everything is version controlled with git. You can find a link to the complete source in the footer. I honestly feel like I'm in some sort of efficiency nirvana. 

It's great.
