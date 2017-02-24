# CHANGELOG

## 2.0.0

`March 6, 2017`

Hey, I'm really excited to announce Rekit 2.0! It is totally a new Rekit to boost your React development. Try it now and you will fall in love with it!

  - Moved Rekit scripts to a separate package ‘rekit-core’ and totally re-wrote with babylon parser instead of the old string matching.
  - Created ‘rekit-portal’ dev tool to manage a Rekit project, which will replace the Rekit sublime plugin.
  - Created a new plugin architecture which allows to enhance or customize Rekit capabilities.
  - Use virtual IO before flush to disk to boost the performance compared to Rekit 1.0. This also makes `rekit-core` easier to test.
  - Allow to rename/move project elements like renaming an async action besides adding/removing.
  - Removed src/components, src/containers folders. They both should belong to a feature now. So that the project architecture is simpler and more consistent. By default there is a feature named ‘common’ where you put common components or containers.
  - Removed the concept of `page` in favor of options of component. A Rekit 1.0 page is now just a component connected to a Redux store and mapped to a url path. In 2.0 you can separate these two options.
  - Allow to create a project using Sass instead of Less.
  - Upgraded to Webpack 2 and React Hot Loader 3.
