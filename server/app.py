from flask import Flask, request, Response
from flask_cors import CORS
import sys
import os
import opentorsion as ot
from OpenTorsion_plotting.plotting import plot_campbell
import matplotlib.pyplot as plt, mpld3

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from OpenTorsion_parser.parser import parse

app = Flask(__name__)
CORS(app)

@app.route('/campbell', methods=['POST'])
def handle_post():
    data = request.json
    '''try:'''
    assembly = parse(data)
    plot_tools = ot.Plots(assembly)
    figure = plot_campbell(plot_tools,
                        frequency_range_rpm=[0, 5000],
                        num_modes=3,
                        harmonics=[1, 2, 3],
                        operating_speeds_rpm=[3600])

    html = mpld3.fig_to_html(figure)
    
    return Response(html, content_type='text/html')
    '''except Exception as e:
        print("/campbell error caught: ", e)
        return Response(str(e), status=400)'''

if __name__ == '__main__':
    app.run(debug=True)