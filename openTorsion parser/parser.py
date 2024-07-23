import opentorsion as ot
import argparse
import json

def add_element(element_dict, disk_list, shaft_list, gear_list, i, prev_element=None):
    """
    Add element to the list corresponding to its type
    """
    if element_dict['type'] == 'Disk':
        current_elem = ot.Disk(i, I=element_dict['inertia'], c=element_dict['damping'])
        disk_list.append(current_elem)
        i+=1
    elif element_dict['type'] == 'ShaftDiscrete':
        current_elem = ot.Shaft(i-1, i, k=element_dict['stiffness'], c=element_dict['damping'])
        shaft_list.append(current_elem)
    elif element_dict['type'] == 'GearElement':
        # if previous element is a gear as well, make it parent of current one
        if prev_element and isinstance(prev_element, ot.Gear):
            current_elem = ot.Gear(i, I=element_dict['inertia'], R=element_dict['radius'], parent=prev_element)
        else:
            current_elem = ot.Gear(i, I=element_dict['inertia'], R=element_dict['radius'])
        
        gear_list.append(current_elem)
        i+=1
    return (i, current_elem)

def add_component(component, disk_list, shaft_list, gear_list, i, prev_element=None):
    """
    Go through elements of component and add them
    """
    for element_dict in component["elements"]:
        i, prev_element = add_element(element_dict, disk_list, shaft_list, gear_list, i, prev_element)

    return (i, prev_element)

def find_component(component_name, components):
    """
    Find component dict based on name
    """
    for component in components:
        if component["name"] == component_name:
            return component

def parse(file_path):
    with open(file_path) as input_json:
        input_data = json.load(input_json)
    
    # changing structure data to list of components
    first_component= input_data['structure'][0][0].split('.')[0]
    list_of_components = [first_component]
    for connection in input_data['structure']:
        next_component = connection[1].split('.')[0]
        list_of_components.append(next_component)
    
    # go through components and add them
    disk_list, shaft_list, gear_list = [], [], []
    i = 0
    prev_element = None
    for component_name in list_of_components:
        component = find_component(component_name, input_data['components'])
        i, prev_element = add_component(component, disk_list, shaft_list, gear_list, i, prev_element)
    
    # creating the assemply object
    if gear_list: # if gear_list is not empty
        assembly = ot.Assembly(shaft_list, disk_elements=disk_list, gear_elements=gear_list)
    else:
        assembly = ot.Assembly(shaft_list, disk_elements=disk_list)
    
    # plotting assembly 
    plot_tools = ot.Plots(assembly)
    plot_tools.plot_assembly()

if __name__=='__main__':
    arg_parser = argparse.ArgumentParser(description="Process a JSON file path.")
    arg_parser.add_argument('json_file', type=str, help='Path to the JSON file')
    json_path = arg_parser.parse_args().json_file

    assert json_path

    parse(json_path)