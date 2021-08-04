if (typeof SortMaterials == 'undefined')
{
    SortMaterials = {};
}

// set a flag for ascending or descending
let sortOrder;

// the current unordered list of material IDs and names
let aUnorderedMaterialIDs = [];
let aUnorderedMaterialNames = [];

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

    // create the sort alphabetical subheader
    contentContainer.appendChild(new FormIt.PluginUI.SubheaderModule('Sort Alphabetically', 'show').element);

    // a short description
    let alphabeticalDescription = document.createElement('div');
    alphabeticalDescription.innerHTML = ' ';
    //alphabeticalDescription.innerHTML = 'Sort by Material name.';
    alphabeticalDescription.id = 'pluginSubheaderDescription';
    contentContainer.appendChild(alphabeticalDescription);

    // sort alphabetical - ascending
    contentContainer.appendChild(new FormIt.PluginUI.Button('Sort Alphabetically (ascending)', SortMaterials.sortAlphabeticallyAscending).element);

    // sort alphabetical - descending
    contentContainer.appendChild(new FormIt.PluginUI.Button('Sort Alphabetically (descending)', SortMaterials.sortAlphabeticallyDescending).element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}


/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/

// returns an array of all in-sketch material names sorted alphabetically
// can be simply reversed later to get names sorted alphabetically descending
SortMaterials.getInSketchMaterialNamesSortedAlphabetically = async function()
{
    // array of material IDs currently in the sketch
    aUnorderedMaterialIDs = await FormIt.MaterialProvider.GetMaterials(FormIt.LibraryType.SKETCH);

    // array of material names currently in the sketch
    aUnorderedMaterialNames = [];

    for (var i = 0; i < aUnorderedMaterialIDs.length; i++)
    {
        // get the name object from FormIt
        let nameObject = await FormIt.MaterialProvider.GetMaterialName(FormIt.LibraryType.SKETCH, aUnorderedMaterialIDs[i]);

        // if the name result is valid, push the name into the array
        if (nameObject.Result == true)
        {
            aUnorderedMaterialNames.push((nameObject.Name).toLowerCase());
        }
    }

    aAlphabeticalMaterialNames = aUnorderedMaterialNames.slice(0).sort();
    return aAlphabeticalMaterialNames;
}

SortMaterials.sortAlphabeticallyAscending = async function()
{
    console.clear();
    console.log("Sort Materials - Alphabetical - Ascending");

    let aAlphabeticalMaterialNames = await SortMaterials.getInSketchMaterialNamesSortedAlphabetically();
    let aAlphabeticalMaterialIDs = [];

    // create an array of IDs in the correct corder
    for (var i = 0; i < aUnorderedMaterialNames.length; i++)
    {
        // get the correct index for each material
        let index = aUnorderedMaterialNames.indexOf(aAlphabeticalMaterialNames[i]);
        //FormIt.ConsoleLog("Index for " + aUnorderedMaterialNames[i] + " is: " + index);

        let materialID = aUnorderedMaterialIDs[index];

        aAlphabeticalMaterialIDs.push(materialID);
    }

    // new API - available in v22 or newer only 
    await FormIt.SketchMaterials.RearrangeMaterials(aAlphabeticalMaterialIDs, WSM.INVALID_ID, false);

    if (aUnorderedMaterialIDs.length > 1)
    {
        let successMessage = 'Sorted ' + aUnorderedMaterialNames.length + ' in-sketch materials in the Materials palette.';
        await FormIt.UI.ShowNotification(successMessage, FormIt.NotificationType.Success, 0);
        console.log("\n" + successMessage);
    }
    else
    {
        let noMaterialsMessage = 'Not enough materials present to sort. Add at least 2 materials to the sketch, then try again.';
        await FormIt.UI.ShowNotification(noMaterialsMessage, FormIt.NotificationType.Information, 0);
        console.log("\n" + noMaterialsMessage);
    }
}

SortMaterials.sortAlphabeticallyDescending = async function()
{
    console.clear();
    console.log("Sort Materials - Alphabetical - Descending");

    let aAlphabeticalMaterialNames = await SortMaterials.getInSketchMaterialNamesSortedAlphabetically();
    let aAlphabeticalMaterialIDs = [];

    // create an array of IDs in the correct corder
    for (var i = 0; i < aUnorderedMaterialNames.length; i++)
    {
        // get the correct index for each material
        let index = aUnorderedMaterialNames.indexOf(aAlphabeticalMaterialNames[i]);
        //FormIt.ConsoleLog("Index for " + aUnorderedMaterialNames[i] + " is: " + index);

        let materialID = aUnorderedMaterialIDs[index];

        aAlphabeticalMaterialIDs.push(materialID);
    }

    let aReverseAlphabeticalMaterialIDs = aAlphabeticalMaterialIDs.reverse();

    // new API - available in v22 or newer only 
    await FormIt.SketchMaterials.RearrangeMaterials(aReverseAlphabeticalMaterialIDs, WSM.INVALID_ID, false);

    if (aUnorderedMaterialIDs.length > 1)
    {
        let successMessage = 'Sorted ' + aUnorderedMaterialNames.length + ' in-sketch materials in the Materials palette.';
        await FormIt.UI.ShowNotification(successMessage, FormIt.NotificationType.Success, 0);
        console.log("\n" + successMessage);
    }
    else
    {
        let noMaterialsMessage = 'Not enough materials present to sort. Add at least 2 materials to the sketch, then try again.';
        await FormIt.UI.ShowNotification(noMaterialsMessage, FormIt.NotificationType.Information, 0);
        console.log("\n" + noMaterialsMessage);
    }
}

