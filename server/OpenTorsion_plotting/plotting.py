import opentorsion as ot
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as patches

def plot_eigenmodes(plot_tools, modes = 3):
    """
    Updated eigenmode plot. Geared systems not supported.
    The eigenvectors are plotted over the assembly schematic, and the
    trajectories are plotted with dashed lines. Each plotted eigenvector is
    rotated so that the node with maximum abs displacement has phase of 0

    Parameters
    ----------
    modes : int
        Number of eigenodes to be plotted
    """
    if plot_tools.assembly.gear_elements is not None:
        raise NotImplementedError('Support for geared assemblies not implemented')
    lam, eigenmodes = plot_tools.assembly.eigenmodes()
    phases = np.angle(eigenmodes)
    nodes = np.arange(0, plot_tools.assembly.dofs)

    fig_modes, axs = plt.subplots(modes, 1, sharex=True)

    for i in range(modes):
        eigenvector = eigenmodes[:, i]
        max_disp = np.argmax(np.abs(eigenvector))
        eigenvector_rotated = eigenvector * np.exp(-1.0j*phases[max_disp, i])
        plot_tools.plot_on_ax(plot_tools.assembly,axs[i], alpha=0.2)
        axs[i].plot(nodes, np.real(eigenvector_rotated)/np.sqrt(np.sum(np.real(eigenvector_rotated)**2)),color='red')
        axs[i].plot([nodes,nodes],[np.abs(eigenvector_rotated),-np.abs(eigenvector_rotated)],'--',color='black')
        axs[i].set_ylim([-1.1,1.1])

    plt.show()
    return fig_modes

def plot_campbell(plot_tools,
                    frequency_range_rpm=[0, 1000],
                    num_modes=5,
                    harmonics=[1, 2, 3, 4],
                    operating_speeds_rpm=[]):
    """
    Plots the Campbell diagram

    Parameters
    ----------
    frequency_range : list, optional
        Analysis frequency range, default is 0 to 100 Hz
    num_modes : int, optional
        Number of modes to be plotted
    harmonics : list, optional
            List containing the harmonic multipliers
        """
    fig, ax = plt.subplots()

    # Operating speeds
    for i, operating_speed_rpm in enumerate(operating_speeds_rpm):
        ax.plot([operating_speed_rpm, operating_speed_rpm],
                [0, harmonics[-1] * (frequency_range_rpm[1] + 50)/60],
                "--",
                color="red")
        rectangle = patches.Rectangle(
            (operating_speed_rpm*0.9, 0),
            operating_speed_rpm*0.2,
            harmonics[-1] * (frequency_range_rpm[1] + 50)/60,
            color='blue',
            alpha=0.2)
        ax.add_patch(rectangle)

    harmonics = sorted(harmonics)

    undamped_nf, damped_nf, damping_ratios = plot_tools.assembly.modal_analysis()
    freqs = undamped_nf[::2]/(2*np.pi)
    freqs = freqs[:num_modes]

    # Natural frequencies
    for i, freq in enumerate(freqs):
        ax.plot(frequency_range_rpm, [freq, freq], color="black",
                label=f"f_{i}={freq.round(2)} Hz")
        ax.text(1.01*frequency_range_rpm[1], freq, f"$f_{i}$")

    # Diagonal lines
    for i, harmonic in enumerate(harmonics):
        ax.plot(frequency_range_rpm,
                [0, harmonic * (frequency_range_rpm[1] + 50)/60],
                color="blue")
        ax.text(
            0.90 * frequency_range_rpm[1],
            0.95 * (frequency_range_rpm[1] + 50) * harmonic / 60,
            f"{harmonic}x"
        )
    ax.legend(loc='upper left')
    ax.set_xlim(frequency_range_rpm)
    ax.set_xlabel("Excitation frequency (rpm)")
    ax.set_ylabel("Natural Frequency (Hz)")

    return fig