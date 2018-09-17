<lasso-page package-path="./browser.json"/><%if (layout !== '_no_layout'){%><%if (locale) {%>
<i18n-use i18n${_.pascalCase(appName)}${_.pascalCase(name)}="${_.pascalCase(appName)}/${name}"/>
<% } %>
<include("src/layouts/${layout}/template.marko")>
    <@body>
        <div className="page-${name}">Page content: ${locale ? ('i18n' + _.pascalCase(appName) + _.pascalCase(name) + '.get(\'name\')') : name}</div>
    </@body>
</include><%}else{%>
<div className="page-${name}">Page content: ${locale ? ('i18n' + _.pascalCase(appName) + _.pascalCase(name) + '.get(\'name\')') : name}</div>
<%}%>