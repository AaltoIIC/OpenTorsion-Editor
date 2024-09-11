from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import sys
import os
import opentorsion as ot
from OpenTorsion_plotting.plotting import plot_campbell, plot_eigenmodes
import matplotlib.pyplot as plt, mpld3

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from OpenTorsion_parser.parser import parse

app = Flask(__name__)
CORS(app)

@app.route('/analysis', methods=['POST'])
def handle_analysis():
    data = request.json
    try:
        assembly = parse(data)[0]
        plots = {}
        plot_tools = ot.Plots(assembly)

        # campbell diagram
        campbell = plot_campbell(plot_tools,
                            frequency_range_rpm=[0, 5000],
                            num_modes=3,
                            harmonics=[1, 2, 3],
                            operating_speeds_rpm=[3600])

        plots['campbell'] = mpld3.fig_to_html(campbell)

        # eigenmodes
        eigenmodes = plot_eigenmodes(plot_tools, modes=3)
        plots['eigenmodes'] = mpld3.fig_to_html(eigenmodes)

    
        return jsonify(plots)
    except Exception as e:
        print("Error analyzing system: ", e)
        return Response(str(e), status=400)

@app.route('/campbell', methods=['POST'])
def handle_campbell():
    data = request.json
    try:
        assembly = parse(data)[0]
        plot_tools = ot.Plots(assembly)
        figure = plot_campbell(plot_tools,
                            frequency_range_rpm=[0, 5000],
                            num_modes=3,
                            harmonics=[1, 2, 3],
                            operating_speeds_rpm=[3600])

        html = mpld3.fig_to_html(figure)
    
        return Response(html, content_type='text/html')
    except Exception as e:
        print("Error plotting campbell diagram: ", e)
        return Response(str(e), status=400)

@app.route('/eigenmodes', methods=['POST'])
def handle_eigenmodes():
    data = request.json
    try:
        assembly = parse(data)[0]
        plot_tools = ot.Plots(assembly)
        figure = plot_tools.plot_eigenmodes(modes=3)

        html = mpld3.fig_to_html(figure)
    
        return Response(html, content_type='text/html')
    except Exception as e:
        print("Error plotting eigenmodes: ", e)
        return Response(str(e), status=400)

if __name__ == '__main__':
    app.run(debug=True)