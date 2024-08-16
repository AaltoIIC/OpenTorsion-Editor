import opentorsion as ot

# Creating 4 shaft elements using stiffness values
# Syntax: ot.Shaft(node 1, node 2, Length [mm], outer diameter [mm], stiffness [Nm/rad])
shaft1 = ot.Shaft(0, 1, L=None, odl=None, k=25e+6)
shaft2 = ot.Shaft(1, 2, L=None, odl=None, k=25e+6)
shaft3 = ot.Shaft(2, 3, L=None, odl=None, k=25e+6)
shaft4 = ot.Shaft(3, 4, L=None, odl=None, k=25e+6)


# Creating a hollow shaft using dimension and material parameter values
# Syntax: ot.Shaft(node 1, node 2, Length [mm], outer diameter [mm], inner diameter [mm], shear modulus [Pa], density [kg/m^3])
shaft5 = ot.Shaft(5, 6, L=400, odl=80, idl=40, G=79e9, rho=7850)

shaft6 = ot.Shaft(6, 7, L=None, odl=None, k=25e+6)
shaft7 = ot.Shaft(8, 9, L=None, odl=None, k=25e+6)

# Creating 5 disk elements
# Syntax: ot.Disk(node, inertia [kgm^2])
disk1 = ot.Disk(0, I=100)
disk2 = ot.Disk(1, I=10)
disk3 = ot.Disk(2, I=50)
disk4 = ot.Disk(3, I=10)
disk5 = ot.Disk(4, I=80)
disk6 = ot.Disk(6, I=80)
disk7 = ot.Disk(7, I=80)
disk8 = ot.Disk(9, I=80)
disk9 = ot.Disk(9, I=80)

# Creating a gear element
# Gears consist of a parent gear and one or more child gear
# Syntax: ot.Gear(node, inertia [kgm^2], gear radius [mm], parent)
gear1 = ot.Gear(4, I=2, R=50, parent=None)  # parent gear
gear2 = ot.Gear(5, I=5, R=150, parent=gear1)  # child gear
gear3 = ot.Gear(8, I=5, R=120, parent=gear1)  # child gear

# Adding the elements to lists corresponding to an element type
shafts = [shaft1, shaft2, shaft3, shaft4, shaft5, shaft6, shaft7]
disks = [disk1, disk2, disk3, disk4, disk5, disk6, disk7, disk8, disk9]
gears = [gear1, gear2, gear3]

# Syntax: ot.Assembly(shaft_elements, disk_elements, gear_elements)
assembly = ot.Assembly(shaft_elements=shafts, disk_elements=disks, gear_elements=gears)

# Assembly can be visualized using openTorsion plotting tools.
plot_tools = ot.Plots(assembly)  # initialize plot tools
plot_tools.plot_assembly()