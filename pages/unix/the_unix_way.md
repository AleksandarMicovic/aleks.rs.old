title: The Unix Way
summary: A collection of articles and interesting things.
author: Aleksandar Micovic
type: page
tags: []
date: 2013-03-29
updated: 2013-03-29


## So we begin...

<span class='code'>ls</span> does one thing and does it well. It lists files.

    $ ls
    file1  file2  file3  filea  fileb  filec

Or it can list a single file.

    $ ls file1
    file1

Or it can list several files.

    $ ls file1 file2 filec
    file1  file2  filec

But <span class='code'>ls</span> doesn't have to support wildcards because those are provided by the shell.

    $ ls *
    file1  file2  file3  filea  fileb  filec

<span class='code'>ls</span> never sees the asterisk, just the files. But what if wildcards aren't sufficient for searching and the user needs regular expressions? <span class='code'>ls</span> doesn't have to provide those either, because the shell provides pipes (<span class='code'>|</span>), and <span class='code'>grep</span> provides regular expressions.

    $ ls | grep '^.*[1-2]$'
    file1
    file2

<span class='code'>ls</span> doesn't have to worry about saving output to a file either, because that's also provided by the shell with <span class='code'>></span>.

    $ ls *[a-c] > file1
    $ cat file1
    filea
    fileb
    filec

Now let's say the user wants big letters instead like those provided by <span class='code'>figlet</span>?

    $ figlet big text
     _     _         _            _  
    | |__ (_) __ _  | |_ _____  _| |_
    | '_ \| |/ _` | | __/ _ \ \/ / __|
    | |_) | | (_| | | ||  __/>  <| |_
    |_.__/|_|\__, |  \__\___/_/\_\\__|
             |___/


Should <span class='code'>ls</span> provide it? No, because <span class='code'>figlet</span> will gladly provide it for <span class='code'>ls</span>.

    $ ls *[1-3] | figlet
      __ _ _      _
     / _(_) | ___/ |
    | |_| | |/ _ \ |
    |  _| | |  __/ |
    |_| |_|_|\___|_|

      __ _ _      ____ 
     / _(_) | ___|___ \
    | |_| | |/ _ \ __) |
    |  _| | |  __// __/
    |_| |_|_|\___|_____|
               
      __ _ _      _____
     / _(_) | ___|___ /
    | |_| | |/ _ \ |_ \
    |  _| | |  __/___) |
    |_| |_|_|\___|____/


Want ls to list files by a cow? Pipe it through <span class='code'>cowsay</span>.

    $ ls file[a-c] | cowsay
     ___________________
    < filea fileb filec >
     -------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

Wanna <span class='code'>rot13</span> it?

    $ ls | rot13
    svyr1
    svyr2
    svyr3
    svyrn
    svyro
    svyrp

Want the cow to <span class='code'>rot13</span> it?

    $ ls *[1-3] | rot13 | cowsay
     ___________________
    < svyr1 svyr2 svyr3 >
     -------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

Want to have a program where the cow tells you your fortune?

    $ cat > cowfortune
    fortune | cowsay
    $ chmod +x cowfortune
    $ mv cowfortune ~/bin
    $ cowfortune
     ______________________________________
    / You look like a million dollars. All \
    \ green and wrinkled.                  /
     --------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

Do you get the idea? The UNIX philosophy to do one thing and do it well means that <span class='code'>ls</span> need not worry about every possible way to list files, and <span class='code'>figlet<span>, <span class='code'>cowsay</span> and <span class='code'>rot13</code> need not know anything about listing files.

<span class='code'>ls</span> is an exception however, since it is *the* most commonly used tool, therefore it provides some of its own conveniences like sorting, etc.

If you think Apple ][ and Commodore 64 are funner than UNIX, you're an accountant or a gamer, not a hacker, and you should probably go back to /g/. 


## About

This was not written by me, but rather by an anonymous user on [4chan's progammming board](http://4chan.org/prog). The original can be found [here](http://dis.4chan.org/read/prog/1317560358/13). I got tired of explaining why UNIX's philosophy is so great, so I've been forwarding people to this page instead.

I've only modified the original for legibility.
