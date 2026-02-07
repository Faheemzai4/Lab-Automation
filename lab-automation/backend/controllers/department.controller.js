import Department from "../models/Department.js";

export const addDepartment = async (req, res) => {
  try {
    const { departmentName, testTypes } = req.body;

    const existing = await Department.findOne({ departmentName });
    if (existing)
      return res.status(400).json({ message: "Department already exists" });

    const department = new Department({ departmentName, testTypes });
    await department.save();

    res
      .status(201)
      .json({ message: "Department added successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { departmentName, testTypes } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { departmentName, testTypes },
      { new: true },
    );

    if (!department)
      return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department updated", department });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
