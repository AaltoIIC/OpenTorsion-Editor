from flask import Flask, request, Response, jsonify, g
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sys
import os
import opentorsion as ot
from OpenTorsion_plotting.plotting import plot_campbell, plot_eigenmodes
import mpld3
import uuid
import time

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from OpenTorsion_parser.parser import parse

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["15 per minute"],
    storage_uri="memory://"
)

@app.before_request
def before_request_func():
    execution_id = uuid.uuid4()
    g.start_time = time.time()
    g.execution_id = execution_id

    print(g.execution_id, "ROUTE CALLED ", request.url)

@app.route('/ping', methods=['GET'])
def ping():
    print(g.execution_id, "/ping CALLED ")
    return 'pong'

@app.route('/analysis', methods=['POST'])
def handle_analysis():
    print(g.execution_id, "/analysis CALLED ")

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

        response_json = jsonify(plots)
        print(g.execution_id, "/analysis COMPLETED ")
        return response_json
    except Exception as e:
        print(q.execution_id, "/analysis FAILED ", str(e))
        return Response(str(e), status=400)

if __name__ == '__main__':
    mode = os.getenv('NODE_ENV', 'development')

    if mode == 'development':
        app.run(debug=True)
    else:
        app.run(debug=False)