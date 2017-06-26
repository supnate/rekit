## Feature oriented architecture

Feature oriented React development

Feature is a very nature concept for people to understand a system. It's also used to describe user requirements for software development. But when a feature comes to programmers side it's usually immediately converted to technical artifacts such as components, actions, models etc. This convention adds the difficulty for new comers or developers themselves serval months later to understand the system. So if we organize an software project by features it will help us always manage the project under control when the project grows.

Unlike backend system, frontend web application is the direct interface for user to understand the capabilities of an application. So it's more suitable to be organized by features.

At first let's define what a feature means: a feature is some capability of a system. That is it adds some function to a system. For example, For a content management system, a new supported content type is a feature, for an IDE the capability to run tests is a feature.

For a complex web application, it's hard to understand how different parts work together. Original developers need to draw architectures, write documents to describe the system. But maintaining them is very hard because when the project evolves docs don't evolve themselves. People need to update them in time so that they won't mislead while they don't help. So how if the project itself is self-describle? A feature oriented architecture is helpful for this.

Because we've grouped components, actions, stores into features, we don't need to think about how these small parts work together but we only consider how features work with each other to provide values for users. Features are much bigger units than pure technical artifacts like components, actions or models. By analyzing dependencies between features the system could auto generate understandable and accurate diagrams for developers to learn or review the project. Let's compare below two diagrams, one contains relationship between small artifacts and the other only contains relationship between features. It's obvious the left one is too complicated to understand. In fact, we usually don't need to care about the complexity inside a feature because it's small and it doesn't prevent from understanding the whole application.

By this approach, we separate concerns of a large project. Each feature is self manageable and decoupled from others. To understand the whole project, we look at relations among features, to understand we only look into a single and small feature.

Since features need to work together, we can't avoid dependencies among features. Actually a new feature is very possible to be based on other existing features. But we also should make feature more individual as much as possible. And we should avoid hard circular dependencies. Here we mention hard dependencies, oppositely we also have soft dependencies. Below is what we define hard and soft:

When feature A is based on feature B, that is B will not work without A. We say the dependency from B to A is a hard dependency.

For example, diagram feature provides visualizationof the project, it uses data from home feature, if no home feature then diagram doesn't work. Then we say diagram hardly depends on home.

When feature A uses some artifacts from B (depends on B) to provide new capabilities, but if without B, A still works by simply remove related code. Then we say the dependency from A to B is a soft dependency.

For example, in Rekit portal application, Rekit-cmds feature provides the ability to manage Rekit elements, but home feature needs to provide menu items as entries. Then we say home softly depends on Rekit-cmds feature. Soft dependencies usually could be dismissed by designing some extension mechanism. For example, if home feature allows other features to register menu items then there will be no dependencies from home to Rekit-cmds. However an extension architecture always adds much complexity to the system, if not heavily needed, we prefer soft dependencies so that the system is easier to understand or debug.



