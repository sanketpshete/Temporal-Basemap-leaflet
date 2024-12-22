import requests
import xml.etree.ElementTree as ET
import json

# URL of the XML file
xml_url = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"
output_json = "linksForBasemap.json"
# Fetch the XML content
response = requests.get(xml_url)
response.raise_for_status()  # Raise an error if the request fails
xml_content = response.content

# Parse the XML
root = ET.fromstring(xml_content)

# Define the namespace mapping
namespaces = {
    "ows": "https://www.opengis.net/ows/1.1",
    "wmts": "https://www.opengis.net/wmts/1.0"
}

# Initialize a list to store extracted data
layers_data = []

# Iterate over each <Layer> element
for layer in root.findall(".//wmts:Layer", namespaces):
    # Extract the title (date info)
    title = layer.find("ows:Title", namespaces).text
    date_info = title.split("Wayback")[-1].strip()[0:-1] 
    print(date_info)

    # Extract the ResourceURL template (tile URL)
    resource_url = layer.find(".//wmts:ResourceURL", namespaces).attrib.get("template")
    
    # Replace placeholders in the tile URL
    tile_url = (
        resource_url.replace("{TileMatrixSet}", "GoogleMapsCompatible")
        .replace("{TileMatrix}", "{z}")
        .replace("{TileRow}", "{y}")
        .replace("{TileCol}", "{x}")
    )

    # Add to layers_data list
    layers_data.append({
        "date": date_info,
        "tile_url": tile_url
    })

# Save the extracted data to a JSON file
with open(output_json, "w") as json_file:
    json.dump(layers_data, json_file, indent=4)

print(f"Extracted data saved to {output_json}")
