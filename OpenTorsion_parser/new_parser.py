import opentorsion as ot

# returns a dictionary of connections from structure
# (assumes each component has one source and one target connection)
def structure_to_dict(structure):
    connections = {}
    for connection in structure:
        connections[connection[0].split('.')[0]] = connection[1].split('.')[0]
    return connections


# returns OpentTorsion assembly from json
def parse(json):
    # make a list of components based on the structure
    list_of_components = []
    if (json['structure'] == []):
        if json['components'] != []:
            list_of_components.append(json['components'][0]['name'])
        else:
            raise ValueError("No components found in the JSON file")
    else:
        structure = structure_to_dict(json['structure'])
        first_component = (set(structure.keys()) - set(structure.values())).pop()
        list_of_components.append(first_component)
        while True:
            next_component = structure[list_of_components[-1]]
            list_of_components.append(next_component)
            if next_component not in structure.keys():
                break
    
    # 