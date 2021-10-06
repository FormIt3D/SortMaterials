if (typeof SortMaterials == 'undefined')
{
    SortMaterials = {};
}

/*** web/UI code - runs natively in the plugin process ***/

// initialize the UI
SortMaterials.initializeUI = async function()
{
    // create an overall container for all objects that comprise the "content" of the plugin
    // everything except the footer
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer'
    window.document.body.appendChild(contentContainer);

    // create the header
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('Sort Materials', 'Sort the list of "In Sketch" materials in the Materials palette.', 'headerContainer').element);

    // add the module that tells customers using old clients that this plugin requires a newer version of FormIt
    contentContainer.appendChild(new FormIt.PluginUI.UnsupportedVersionModule('2022.1').element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}