#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, url_for
from flask_flatpages import FlatPages
from werkzeug.contrib.atom import AtomFeed

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)

# Top level pages.

@app.route("/")
def index():
    blog_posts = [page for page in pages if 'blog' in page.meta['type']]
    posts = sorted(blog_posts, key=lambda a: a.meta['date'], reverse=True)[:3]
    return render_template("index.html", pages=posts)

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/archive")
def archive():
    blog_posts = [page for page in pages if 'blog' in page.meta['type']]
    posts = sorted(blog_posts, key=lambda a: a.meta['date'], reverse=True)
    return render_template("archive.html", pages=posts, full=True)

@app.route("/writings")
def writings():
    return render_template("writings.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/tag/<string:tag>/")
def tag(tag):
    tagged = [page for page in pages if tag in page.meta.get('tags', [])]
    return render_template("tag.html", pages=tagged, tag=tag, full=False)

# Pages with content.

@app.route("/<path:path>/")
def page(path):
    page = pages.get_or_404(path)
    return render_template("page.html", page=page)

# Feed.

@app.route('/recent.atom')
def recent_feed():
    url = "aleks.rs"
    feed = AtomFeed(u"aleks.rs — Recent Articles", feed_url=url, url=url)
    all_pages = [page for page in pages]
    sorted_pages = sorted(all_pages, key=lambda a: a.meta['date'], reverse=True)[:5]

    for page in sorted_pages:
        feed.add(unicode(page.meta.get('title')),
                 unicode(page.html),
                 content_type='html',
                 author=page.meta.get('author'),
                 url=url_for('page', path=page.path),
                 updated=page.meta.get('updated'),
                 published=page.meta.get('date'))
    return feed.get_response()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
