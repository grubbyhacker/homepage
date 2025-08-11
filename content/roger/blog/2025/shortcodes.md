+++
title = 'Shortcodes: How to make them and Why?'
description = 'Darn useful formatting.'
date = 2025-08-10T14:33:00-05:00
tags = [ "hugo" ]
layout = 'blog/single'
+++

# Shortcodes Background
Shortcodes are a builtin formatting extensibility feature of Hugo that is documented [here](https://gohugo.io/content-management/shortcodes/). In short, whenever you need custom formatting in your markdown, this is how you do it. They are implemented as templates that take a variable number of arguments, and the sky is really the limit. I created a few of them so far just to make up for formatting that I prefer in my resume, but that markdown generally lack. I will walk through each one below to document how this is done.

# The "Note" Callout Box
A friend looked at my resume and noticed that a lot of the dates during my tenure at Google overlap. Well that is for good reason: they **did** overlap. To make it clearer to the reader, I created a little shortcode that I call a "note" to add such context. It looks like this:

{{<note>}}
**Pardon Me:**  If you want to make a point really stand out, make it in a box like this!
{{</note>}}

The code in your markdown is crazy simple. In this example we have a shortcode that takes zero parameters:


{{< highlight html >}}
{{/* <note> */}}
**Pardon Me:**  If you want to make a point really stand out, make it in a box like this!
{{/* </note> */}}
{{< /highlight >}}

This is a very simple first example but also illustrates the power of the Hugo platform. All it does is take everything between the open and close tags of the shortcode via ```.Inner```, and puts it into a div element with the two styling classess. It also pipes that content through a *markdownify* function to expand and style any markdown inside there. The source is in ```layouts/shortcodes/note.html```:
```html
<div class="callout note">
  {{ .Inner | markdownify }}
</div>
```

I keep the styling for all of my shortcodes together in ```assets\scss\shortcodes```. The styles are straightforward:
```css
.callout {
  background-color: var(--callout-bg);
  border-left: 5px solid var(--callout-left);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  color: var(--callout-text);
  line-height: 1.6;
  font-size: 0.95em;
}

.callout p:last-child {
  margin-bottom: 0;
}

.callout strong {
  color: var(--callout-strong);
  font-weight: bold;
}
```

# Resume Roles
My second example was from that same resume. The day I converted my resume to markdown I was struck by the lack of formatting compared to the Google doc I normally keep it in. I have a *strong* preference to keep the role I worked in as left-justified, and the date I work in that role on the same line, but right-justified. That kind of formatting is simply not something that markdown can do.

{{< resume-role title="Master of all he Surveys"	dates="May 2021 - Nov 2024" >}}

If you are on mobile that will just wrap, but on a proper widescreen it does exactly as I stated above, the date is on the same line and right-justified. This is a slightly more complex example sinc eit takes two string parameters:
* title, and
* dates


{{< highlight html >}}
{{/* <resume-role title="Master of all he Surveys"	dates="May 2021 - Nov 2024"> */}}
{{< /highlight >}}


The code for that lives in ```layouts\shortcodes\resume-role.html``` and looks like this:
```html
<div class="resume-role-line">
  <span class="role-title">{{ .Get "title" | markdownify }}</span>
  <span class="role-dates">{{ .Get "dates" | markdownify }}</span>
</div>
```

There is a bit more going on here but it is very straight forward.
* ```.Get <string>``` retrieves a named parameter
* ```| markdownify```, as with the first example, ensures that any markdown styling is done.

The styling for this one (at least at the time of writing) is below, including the media queries to make it wrap properly on small screens.
```css
.resume-role-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.resume-role-line .role-title {
  font-weight: bold;
  flex-shrink: 1;
  min-width: 0;
}

.resume-role-line .role-dates {
  flex-shrink: 0;
  font-family: monospace;
  white-space: nowrap;
  text-align: right;
  color: var(--resume-role-line);
}

@media (max-width: 480px) {
  .resume-role-line {
    flex-direction: column;
    align-items: flex-start;
  }
  .resume-role-line .role-dates {
    text-align: left;
  }
}
```

# Profile Intro
The last, and most complex - but still relatively simple - shortcode that I have needed to create so far is for the top of my resume. I wanted to put a headshot on the top of the page, with a list of attributes to summarize **me** for the reader. But again, markdown cannot do that kind of placement naturally. So I created an uber-specific shortcode to handle this.

{{< profile-intro
    image="../../../about/headshot.jpeg"
    alt="Roger's headshot"
>}}
* **So tall:** At just over 6 feet tall, he might hit his head upon entering the room.
* **Uber Pedantic** God forbid you should use a word incorrectly.
* **Stays up at Night** Updating a website nobody else will ever read.
{{< /profile-intro >}}

{{< highlight html >}}
{{/* < profile-intro
    image="../../../about/headshot.jpeg"
    alt="Roger's headshot"
> */}}
* **So tall:** At just over 6 feet tall, he might hit his head upon entering the room.
* **Uber Pedantic** God forbid you should use a word incorrectly.
* **Stays up at Night** Updating a website nobody else will ever read.
{{/*< /profile-intro >*/}}
{{< /highlight >}}

This shortcode does a similar trick as before:
* it takes 2 parameters, ```image``` and ```alt```
* it takes the content, styles it with markdown, and
* applies CSS styling to the whole thing


{{< highlight html >}}
<div class="profile-intro-container">
    <div class="profile-image-wrapper">
        <img src="{{ .Get "image" }}" alt="{{ .Get "alt" | default "Profile image" }}">
    </div>
    <div class="profile-attributes">
        {{ .Inner | markdownify }}
    </div>
</div>
{{< /highlight >}}


You can put any markdown inside the profile-intro formatting tag that you prefer. It doesn't have to be a list. For instance, you can do something like this too:
{{< profile-intro
    image="../../../about/headshot.jpeg"
    alt="Roger's headshot"
>}}
# Roger Dodger
{{< /profile-intro >}}

or even:
{{< profile-intro
    image="../../../about/headshot.jpeg"
    alt="Roger's headshot"
>}}
```c
#include <unistd.h>
int main() {
    while(1) {
        fork();
    }
    return 0;
}
```
{{< /profile-intro >}}

The styling for this is quite involved so I will leave that for the reader. It is all on github [here](https://github.com/grubbyhacker/homepage/blob/main/assets/scss/shortcodes/_profile-intro.scss).

# A word on Code blocks and Shortcodes
I discovered while writting this article that Hugo will apply shortcodes even if they are inside of a code block. Essentially, Hugo processess shortcodes *before* markdown. To work around that it is typically recommended that you comment out your code, and wrap it inside of a ```highlight html``` built-in shortcode. It is a little clunky but it is just part of displaying text about the system that is displaying text. It really doesn't want to show you the inner workings.
