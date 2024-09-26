export const basicComponents = [
    {
       name: "Windmill Turbine",
       json: {
              name: "Windmill Turbine",
              elements: [
                {
                    name: "Disk 1",
                    type: "Disk",
                    inertia: 9.20e+06,
                    damping: 0
                }
            ]
       }
    },
    {
        name: "Windmill Rotor",
        json: {
            name: "Windmill Rotor",
            elements: [
                {
                    name: "Disk 1",
                    type: "Disk",
                    inertia: 3.43e+03,
                    damping: 1
                },
                {
                    name: "Shaft 1",
                    type: "ShaftDiscrete",
                    stiffness: 5.55e+09,
                    damping: 0
                },
                {
                    name: "Disk 2",
                    type: "Disk",
                    inertia: 9.52e+04,
                    damping: 0,
                    excitation: {
                        type: "excitationValuesRpmPercentage",
                        values: [
                            [
                                4,
                                0.001466
                            ],
                            [
                                6,
                                0.02026
                            ],
                            [
                                8,
                                0.002442
                            ],
                            [
                                10,
                                0.003751
                            ],
                            [
                                12,
                                0.01392
                            ],
                            [
                                14,
                                0.001561
                            ],
                            [
                                16,
                                0.001928
                            ]
                        ]
                    }
                }
            ]
        }
    },
    {
        name: "Shaft",
        json: {
            name: "Shaft",
            elements: [
                {
                    name: "Shaft 1",
                    type: "ShaftDiscrete",
                    damping: 0,
                    stiffness: 3.68e+08
                }
            ]
        }
    },
]