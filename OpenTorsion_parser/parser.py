import opentorsion as ot

def find_component_by_name(name, components):
    for component in components:
        if component['name'] == name:
            return component

'''
Returns tuple of assembly and excitation_dict

assembly: OpenTorsion Assembly object
excitation_dict: keys are node coordinates and value is excitation at that coordinate. 
excitation value is list of tuples [(multiplier, excitation as percentage of the torque)]
'''
def parse(json):
    structure = json['structure']
    components = json['components']
    i = 0
    elements = {
                    'disks': {},
                    'shafts': {},
                    'gears': {}
                }
    # system excitation
    excitation_dict = {}
    def add_excitation (node, excitation):
        if node in excitation_dict:
            excitation_dict[node] = excitation_dict[node] + excitation
        else:
            excitation_dict[node] = excitation

    def add_part(component):
        nonlocal i

        connected_components = {}
        for connection in structure:
            if connection[0].split('.')[0] == component['name']:
                output_element = connection[0].split('.')[1]
                # assumes input element of a component is always its starting element
                connected_components[output_element] = connection[1].split('.')[0]

        for element in component['elements']:
            elem_name = f"{component['name']}.{element['name']}"

            # add element and excitation to elements and excitations variables
            if element['type'] == 'Disk':
                # if there's already a disk on the same node, combine them
                last_disk_key = list(elements['disks'])[-1] if elements['disks'] else None
                if (last_disk_key and elements['disks'][list(elements['disks'])[-1]].node == i):
                    elements['disks'][last_disk_key].I += element['inertia']
                    elements['disks'][last_disk_key].c += element['damping']
                else:
                    elements['disks'][elem_name] = ot.Disk(
                        i,
                        I=element['inertia'],
                        c=element['damping']
                    )
                
                if 'excitation' in element:
                    add_excitation(i, element['excitation']['values'])
            elif element['type'] == 'ShaftDiscrete':
                elements['shafts'][elem_name] = ot.Shaft(
                    i,
                    i+1,
                    k=element['stiffness'],
                    c=element['damping']
                )
                if 'excitation' in element:
                    add_excitation(i, element['excitation']['values'])

                i += 1
            elif element['type'] == 'ShaftContinuous':
                density = element['density'] if 'density' in element else None
                elements['shafts'][elem_name] = ot.Shaft(
                    i,
                    i+1,
                    L=element['length'],
                    idl=element['innerDiameter'],
                    odl=element['outerDiameter'],
                    rho=density
                )
                if 'excitation' in element:
                    add_excitation(i, element['excitation']['values'])

                i += 1
            elif element['type'] == 'GearElement':
                gear_length = element['teeth'] if 'teeth' in element else element['diameter']
                parent_gear = None

                if ('parent' in element and
                    f'{component['name']}.{element['parent']}' in elements['gears']):
                    i += 1
                    parent_gear = elements['gears'][f'{component["name"]}.{element["parent"]}']

                elements['gears'][elem_name] = ot.Gear(
                    i,
                    I=element['inertia'],
                    R=gear_length,
                    parent=parent_gear
                )
                if 'excitation' in element:
                    add_excitation(i, element['excitation']['values'])
            
            # call add_part on connected components
            if element['name'] in connected_components:
                connected_comp = find_component_by_name(
                    connected_components[element['name']],
                    components
                )
                add_part(connected_comp)
    
    # find starting component
    connection_starts = [connection[0].split('.')[0] for connection in structure]
    connection_ends = [connection[1].split('.')[0] for connection in structure]
    starting_components = list(set(connection_starts) - set(connection_ends))

    if len(starting_components) > 1:
        raise ValueError("JSON contains more than one group of connected components.")
    elif len(starting_components) == 0:
        if (len(components) == 1):
            starting_components = [components[0]['name']]
        else:
            raise ValueError("JSON contains no connected components.")

    starting_component = find_component_by_name(starting_components[0], components)

    # fill elements dictionary and create assembly
    add_part(starting_component)
    assembly = ot.Assembly(
        elements['shafts'].values(),
        disk_elements=(elements['disks'].values() or None),
        gear_elements=(elements['gears'].values() or None)
    )

    return (assembly, excitation_dict)