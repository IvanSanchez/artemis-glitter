node-artclientlib
=================

Node.js client library for Artemis Space Bridge Simulator.


**node-artclientlib** implements the [Artemis Spaceship Bridge Simulator](http://www.artemis.eochu.com/) game protocol, and provides facilities to responding to game events (at the moment, an event handler can be attached to a limited number of game packets).

Altough done from scratch, the [Artemis Packet Protocol](https://github.com/rjwut/ArtClientLib/wiki/Artemis-Packet-Protocol) documentation from @rjwut's ArtClientLib has been inmensely helpful.

If you're doing something with this, I hope you do have a proper copy of Artemis SBS. Seriously, spend the $40. It's really worth it.



Planned features
-------------------

* Implement all the known packet types.
* Implement a complete world model. Allow for querying last known status of all entities.
* Provide a web front-end with an openlayers- or leaflet- based map, try to mimick the functionality of the Science console. This shall be a basic Express.js application using the library.



