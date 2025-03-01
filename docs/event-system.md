# Event System

astrid includes it's own event system for dispatching events to registered listeners. Events let you know when something occurs within your application. They can be generated by user input such as the mouse or keyboard, or from other input like external data services. Events can also be generated in response to visual or states changes.

You can handle events in your code by adding an event handler on the object you wish to receive events from.

The event system is based on the same event system used in the standard DOM (DOM Level 3 Event Model), even though it does not implement the entire DOM Level 3 Event specification the implementations are alike. The event system contains the core Event object and it's subclasses, as well as one or more Event Dispatchers.

Objects not only create and dispatch events but also listen to (handle) events. To receive an event, one object will add an event handler on another object. When an event occurs, an object will dispatch that event to all registered event handlers by calling into the event handlers registered function. You can add any number of event handlers to any number of objects.

The framework includes it's own built-in events that you can handle in your code and a lot as a part for making your game or app interactive. You can also define your own custom events and dispatch them using the same event dispatching model. Events usually contain various information related to that event. For example, an event dispatched by a mouse might include the `x` and `y` position of the pointer, other events may not include any information, for example, change events, to indicate that something within an object has changed.

Some events also participate in an event flow, but not all. Only events that are sent to a drawable with an active visual tree participate in this event flow and it's important to understand how these events propagate through the visual tree.


## The Event Flow

When an event is dispatched, that event go through what is called the event flow or propagation path, from the root of the visual tree to a target, checking for registered handlers in between. The target is the drawable in the visual tree where the event originated. For example, if a user taps on a drawable named `A`, a touch event will be dispatched with `A` as the target.

Only drawables, or objects that are within a parent-child hierarchy can participate in the event flow, other objects simply execute their event handler functions on the object. Propagation can also be stopped by calling the event objects `stopPropagation` or `stopImmediatePropagation` methods.

The event flow is broken up into three phases: The capturing, targeting and the bubbling phase. The following describes these three phases:


### The Capturing Phase

This phase takes all of the drawables from the root drawable to the parent drawable of the target. During this phase, each drawable is checked (starting at the root) to see if it has an event handler registered to handle the event and if so, it is executed. This phase ends when the target's parent is reached.
 

### The Targeting Phase

This phase only handles the target, it tries to execute any event handler functions registered on the target drawable only.
 

### The Bubbling Phase

This is probably one of the more important phases, this phase takes all the drawables from the parent drawable of the target to the root, the opposite of the capturing phase. During this phase, each drawable is checked (starting at the target's parent) to see if it has an event handler registered to handle the event, stopping after the root. 

_Note: The bubbling phase only occurs if the events canBubble is set to true, otherwise this phase is skipped._


## The Event Dispatcher

The Drawable class inherits from the NamedObject class, which in turn inherits from the EventDispatcher class. The EventDispatcher class is an important base class that provides the core functionality and handling of the Mochica event system. All drawables have access to the methods of EventDispatcher.

The most important and commonly used method of EventDispatcher is the `addEventHandler`, you use this method to register your event handlers on an object. When creating your own classes that derive from `EventDispatcher`, you will want to call `dispatchEvent` with an event object. Handlers registered for your event will then receive your event object.

It's important to note that the event dispatcher is not asynchronous, meaning, when an event is dispatched via the `dispatchEvent` method, the `dispatchEvent` call does not return until all handlers have run. To keep things running smooth, expensive tasks should be broken up into smaller chunks and run as needed or split up to run at various phases of the rendering cycle.


## The Event and Event Subclasses

The Event class has properties that contain information about the event that occurred. A new Event object will be created each time an event is dispatched. During event propagation via the targeting or bubbling phase, the event will be modified instead of creating a new event object.

Various events are included in the framework, like MouseEvent, KeyEvent. When building your custom events you can either extend a built-in event or create your own new event object that derives from the base Event class.
