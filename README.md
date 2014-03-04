d3sankey-QV11
==============

Repository for storing the code for the D3 sankey extension for QlikView 11.

I built this extension based on Mike Bostock's sankey chart built from his d3 library:

http://bost.ocks.org/mike/sankey/

This extension is in the early phases and pretty basic at this point.  There are many ways in which is could be improved, so feel free to take a shot at it.

Here is a description of the properties and needed formatting of those properties:
 
**Path** is the dimension which holds the names of the different nodes separated by a character (probably a comma).  Since a sankey chart essentially visualizes a path between different nodes, this dimension should represent that path.  Please see the example app to make more sense of this concept.
 
**Frequency** is the expression which controls the size of the path.  So if we're trying to visualize the path that was taken, it will use this value to determine how large to make the line between the nodes.
 
The **Reverse Sort Order** is simply a checkbox to easily reverse the order of the path being displayed.  Sometimes the sankey chart is easier to read in a different order than the specified path.

**Path Separator** is where you specify the character that you want to use as the separator between nodes for the Path.
 
**SOME THINGS TO NOTE:**
As is always the case, be careful how many nodes and paths you are trying to visualize.  Not only will the chart be unreadable, it could make the extension extremely slow.  It could be a good idea to reduce the data set.

Since this is a D3 viz using SVG, it's only visible in more modern browsers.  Basically, this won't work in IE8 and below.
