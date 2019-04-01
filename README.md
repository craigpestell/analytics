Analytics

Welcome to Analytics, the module which orchestrates user event tracking web front-ends.

Analytics 

**Features**
* domEvents - each component can configure and publish DOM event handlers
* dataMap - each event can pass a dataMap: an object in which each property name represent data entities to be consumed by analytics, and the value is a promise which will resolve with the data.  Currently each promise will have the event parameter passed to it.
* AnalyticsBehavior - a Marionette Behavior which can be implemented by a view. Implementing the Behavior will supplement the View with ui & event hashes for pre-defined events.  This allows developers to have analytics events out-of-the-box for their Component or Feature


TUTORIALS
A tutorial:

is learning-oriented
allows the newcomer to get started
is a lesson
Analogy: teaching a small child how to cook

HOW-TO GUIDES
A how-to guide:

is goal-oriented
shows how to solve a specific problem
is a series of steps
Analogy: a recipe in a cookery book

EXPLANATION
An explanation:

is understanding-oriented
explains
provides background and context
Analogy: an article on culinary social history

REFERENCE
A reference guide:

is information-oriented
describes the machinery
is accurate and complete
Analogy: a reference encyclopaedia article