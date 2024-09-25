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


# Dictionary to store plot metadata 
plot_storage = {}

@app.route('/api/analysis', methods=['POST'])
def handle_analysis():
    data = request.json
    try:
        assembly = parse(data)[0]
        plots = []
        plot_tools = ot.Plots(assembly)

        # campbell diagram
        campbell = plot_campbell(plot_tools,
                            frequency_range_rpm=[0, 5000],
                            num_modes=3,
                            harmonics=[1, 2, 3],
                            operating_speeds_rpm=[3600])

        plots.append({
            "name": "Campbell Diagram",
            "html": mpld3.fig_to_html(campbell)
        })

        # eigenmodes
        if (assembly.gear_elements is None):
            try:
                nof_modes = min( assembly.eigenmodes()[1].shape[0], 3)
                eigenmodes = plot_eigenmodes(plot_tools, modes=nof_modes)
                plots.append({
                    "name": "Eigenmodes",
                    "html": mpld3.fig_to_html(eigenmodes)
                })
            except:
                pass

        return jsonify(plots)
    except Exception as e:
        print(f'Analysis failed: {e}')
        return Response(str(e), status=400)

if __name__ == '__main__':
    app.run(debug=True)