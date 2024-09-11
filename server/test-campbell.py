import sys
import os
import opentorsion as ot
import matplotlib.pyplot as plt, mpld3
import json
from OpenTorsion_plotting.plotting import plot_campbell

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from OpenTorsion_parser.parser import parse

json_path = './system.json'
with open(json_path) as input_json:
    input_data = json.load(input_json)
    assembly = parse(input_data)
    plot_tools = ot.Plots(assembly)

#figure = plot_eigenmodes(plot_tools, modes=3)
figure = plot_campbell(plot_tools,
                        frequency_range_rpm=[0, 5000],
                        num_modes=3,
                        harmonics=[1, 2, 3],
                        operating_speeds_rpm=[3600])
mpld3.save_html(figure, 'plot_campbell.html')
