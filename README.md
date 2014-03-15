artemis-glitter
=================

Node.js client library and blinky things for Artemis Space Bridge Simulator.


**artemis-glitter** implements the [Artemis Spaceship Bridge Simulator](http://www.artemis.eochu.com/) game protocol, and provides facilities to responding to game events (at the moment, an event handler can be attached to a limited number of game packets).

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



Planned features
-------------------

* Implement all the known packet types.
* Implement a complete world model. Allow for querying last known status of all entities.
* Provide a web front-end (express.js-based) with several possible auxiliary, display-only stations:
 * An openlayers- or leaflet- based map, try to mimick the functionality of the Science console. 
 * A "nav helper" console, showing BRG, DST, HDG, SHLD of vessels. Has to look like just a non-user-friendly grid of callsigns and numbers. Numbers are fuzzed if power to sensors is low.
 * A "combat helper" console, showing the vessel currently targeted by Weapons, plus its status. To not destroy playability, the information about frequencies, shields and damaged systems shall take a few seconds (depending on power allocated to sensors)
 * A "prox helper" console. Big, fat letters reading "PROXIMITY ALERT" when the vessel goes near a mine. Extendable to "low energy", "raise shields" when hit with shields down, "under fire", "red alert", "warping"/"jumping" or some other statuses.
 * A "station helper" console, showing the status and amount of ordnance available at deep space stations, visually similar to the nav helper.
 * A "ammo helper" console, showing just the loaded tubes, beam freqs and beam recharge status in big, fat, blinking icons.
 * An "engineering graph" console, showing the energy stores, energy consumption, amount of system damage and heat over time, in a two-axis graph. Maybe use highcharts or d3 for this one.



