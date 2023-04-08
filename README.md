# voxelblog
A very simple blog site with markdown text parsed with the marked library. This was kind of rushed so the code may be bad

# Self-hosting
As the posts themselves are in another branch of this github repo, this is very easy to self-host.

Fork the repo, make sure GitHub pages is working correctly, modify the ``posts.json`` in the ``posts`` branch, change the URL in the ``index.js`` for line 61 to the config's raw github content path, and line 104 to the posts's raw github content path.
