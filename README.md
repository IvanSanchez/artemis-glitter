artemis-glitter
=================

Node.js client library and blinky things for Artemis Space Bridge Simulator.


**artemis-glitter** is a web front-end to the [Artemis Spaceship Bridge Simulator](http://www.artemis.eochu.com/) game.

Technically speaking, it's a node.js-based web server which uses raw TCP sockets and buffer parsers to understand the Artemis SBS protocol, then provides event handlers for all kinds of packets plus a world model on top, plus socket.io to communicate with web browsers, plus a few (as of now, three) webpages using all that, which look impressively nice when displayed alongside a native Artemis console.

Altough done from scratch, the [Artemis Packet Protocol](https://github.com/rjwut/ArtClientLib/wiki/Artemis-Packet-Protocol) documentation from @rjwut's ArtClientLib has been inmensely helpful.

If you're doing something with this, I hope you do have a proper copy of Artemis SBS. Seriously, spend the $40. It's really worth it.


Why are you doing this?
--------------------------

Because one of the things I like from sci-fi is gratuitous blinking lights and switches and dials everywhere.

Artemis is a fine game, but I think I can improve the experience by allowing more laptops, tables and phones to display more information that you don't really need, but that looks good anyway. If people have a laptop, a tablet and a phone, why not let them play in the laptop and have the tablet and phone as auxiliary displays that look futuristic?


Why the name?
---------------

It's a long story which involves #GeoGlitterDomination and a high-visibility vest with frills.

The name is appropiate for blinky things that you put on top of something, and unique enough to the vocabulary that players of Artemis use.


Current features
--------------------

* Connects properly to an Artemis server and understands most of the information sent by it.
* Supports Artemis 2.1.1 **only**. Will not work with previous versions.
* Implements a more-or-less complete world model.
* Provides a web front-end with:
  * Debug map able to display the entire world model
  * A "bearing-distance table" console, showing BRG, DST and HDG of nearest vessels/stations. Looks like a non-user-friendly grid of callsigns of numbers.
  * A "proximity monitor" console, showing distances to the nearest asteriod/enemy/nebula/mine and providing audio feedback when too close to any of them, or when a red alert is sounded, or when the vessel is hit when shields are down.
  * A "torpedo tube matrix" console, showing the status of the torpedo tubes and allowing to quickly load ordnance.
* All packed with node-webkit so that non-nerdy windows users can run it without major problems.


How do I run this thing?
-----------------------------

Go to https://github.com/IvanSanchez/artemis-glitter/releases and download the latest release for your architecture (Windows, MacOSX, or Linux 32- or 64-bit). Unzip, and run the only executable file.

Some features require Glitter to know about the `vesselData.xml` file, and the `*.snt` files that Artemis uses (these define the player ship's configuration and hardpoints). This can be done in two ways:

* Copy the entire `dat` directory to where you unzipped Glitter. (Linux and Mac users might prefer to make a symbolic link instead)
or
* Edit the configuration file `config/default.yaml`, and change `datDir` to the full path of the directory holding `vesselData.xml`. This should *typically* be something like `C:\Program Files\Artemis\dat\`.

If you're using any mods, take care to point `datDir` to the appropiate place.

If you're running linux and Glitter doesn't start, it might be due to an issue regarding `libudev0`. Please read https://github.com/rogerwang/node-webkit/wiki/The-solution-of-lacking-libudev.so.0


Planned features
-------------------

* Refactor the world model and provide functions for per-vessel visibility, depending on scanned status and active use of cloaker ability
* Implement a sub-world model with a subset of nearby vessels (maybe 20K radius) by pigeon-holing all entities based on coordinates-modulus-10000. Update the "nearby world model" whenever the player vessel moves from a pigeon hole to another, change pigeon holes of other entities as they move. This will allow for quicker updates of the world model in slower CPUs (embedded ARM).
* Provide an i2c interface, so we can light stuff up when running Glitter from a Raspberry Pi.
* A "combat helper" console, showing the vessel currently targeted by Weapons, plus its status. To not destroy playability, the information about frequencies, shields and damaged systems shall take a few seconds (depending on power allocated to sensors)
* A "station helper" console, showing the status and amount of ordnance available at deep space stations, visually similar to the nav helper.
* Improve the torpedo tube matrix console, to include beam freqs and beam recharge status in big, fat, blinking icons. Provide very basic auto-targeting (nearest drone, then nearest vessel).
* An "engineering graph" console, showing the energy stores, energy consumption, amount of system damage and heat over time, in a two-axis graph. Maybe use highcharts or d3 for this one.
* A "science sensor" console showing a polar graph of nearby stuff, with three settings: Grav, µwave, lidar. The gravimetric sensor shows massive entities (and doesn't show nebulae, mines or anomalities). The µwave sink shows artificial radiation from vessels, stations and anomalities. Lidar shows light-absorbing entities and it's blocked by them.
* Speech synthesis support. Then, a very basic comms console AI (speaks everything) and a very basic science console AI (scans everything, speaks as it scans or weap/capt target stuff)


I think it would be cool to have X, will you do it?
--------------------------------------------------------------

Short answer: No, go do it yourself.

Long answer: I do this for fun. Which means I don't want to be tied up by feature requests and bug reports. I do not have the patience for people asking for all-encompassing changes.

If you have the skills needed for web programming and/or web design, and know how to checkout and commit stuff to a Git repository, then, by all means, implement the changes you want and send a pull request.

If you are a techie with a very clear idea for a small change, then, by all means, use the bug tracker.

If you're not a techie and want to suggest something, I'd really appreciate if you'd read http://catb.org/~esr/faqs/smart-questions.html before hitting the keyboard.


How do I build this?
------------------------

This package is based on `node.js` and uses `npm` for downloading and installing dependencies.  Platform packages are built using `grunt` and `grunt-node-webkit-builder`.

So the quick version to build this package is:

Install `grunt-cli` via `npm` if you haven't done this already:

   `$ npm install -g grunt-cli`

Then install the build dependencies like so:

   `$ npm install`

Finally, build the packages:

   `$ grunt`






