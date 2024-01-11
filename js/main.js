
function fetchGasInfo() {
    const gas = document.getElementById('gasSelect').value;
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://api.luchtmeetnet.nl/open_api/components/" + gas, requestOptions)
        .then(response => response.text())
        .then(result => {
            const processedData = processApiData(result);
            document.getElementById('result').innerHTML = `
                <p><strong>Formula:</strong> ${processedData.formula}</p>
                <p><strong>Description (EN):</strong> ${processedData.descriptionEN}</p>
                <p><strong>Description (NL):</strong> ${processedData.descriptionNL}</p>
            `;
        })
        .catch(error => {
            console.log('error', error);
            document.getElementById('result').innerText = 'Error fetching data.';
        });
}

function processApiData(apiData) {
    function extractText(descriptionJson) {
        let text = '';
        descriptionJson.document.nodes.forEach(node => {
            node.nodes.forEach(textNode => {
                if (textNode.object === 'text') {
                    text += textNode.text + ' ';
                }
            });
        });
        return text.trim();
    }

    const parsedData = JSON.parse(apiData);
    const formula = parsedData.data.formula;
    const englishDescriptionJson = JSON.parse(parsedData.data.description.EN);
    const englishDescription = extractText(englishDescriptionJson);
    const dutchDescriptionJson = JSON.parse(parsedData.data.description.NL);
    const dutchDescription = extractText(dutchDescriptionJson);

    return {
        formula: formula,
        descriptionEN: englishDescription,
        descriptionNL: dutchDescription
    };
}
