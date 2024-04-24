import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./App.css";

type Student = {
  name: string;
  correct: number;
  total: number;
};

function calculateScorePercentage(correct: number, total: number): number {
  return total !== 0 ? (correct / total) * 100 : 0;
}

function getBackgroundColor(correct: number, total: number): string {
  if (total === 0 && correct === 0) {
    return "#FFFFFF";
  } else {
    const scorePercentage = (correct / total) * 100;
    if (scorePercentage >= 90) {
      return "#4CAF50";
    } else if (scorePercentage >= 75) {
      return "#8BC34A";
    } else if (scorePercentage >= 50) {
      return "#FFEB3B";
    } else if (scorePercentage >= 35) {
      return "#FF9800";
    } else {
      return "#F44336";
    }
  }
}

function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("students");
    if (saved) {
      const initialValue = JSON.parse(saved);
      return initialValue;
    } else {
      return [
        { name: "", correct: 0, total: 0 },
        { name: "", correct: 0, total: 0 },
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleNameChange = (index: number, newName: string) => {
    const updatedStudents = [...students];
    updatedStudents[index].name = newName;
    setStudents(updatedStudents);
  };

  const updateStudentCount = (
    index: number,
    field: string,
    operation: string
  ) => {
    const updatedStudents = [...students];
    if (operation === "plus") {
      if (field === "correct") {
        updatedStudents[index][field] += 1;
        if (updatedStudents[index][field] > updatedStudents[index].total) {
          updatedStudents[index].total = updatedStudents[index][field];
        }
      } else if (field === "total") {
        updatedStudents[index][field] += 1;
        if (updatedStudents[index].correct === updatedStudents[index].total) {
          updatedStudents[index].correct = updatedStudents[index][field];
        }
      }
    } else if (operation === "minus" && updatedStudents[index][field] > 0) {
      if (
        field === "correct" &&
        updatedStudents[index].correct === updatedStudents[index].total
      ) {
        updatedStudents[index].correct -= 1;
      }
      updatedStudents[index][field] -= 1;
      if (
        field === "total" &&
        updatedStudents[index].correct > updatedStudents[index].total
      ) {
        updatedStudents[index].correct = updatedStudents[index].total;
      }
    }
    setStudents(updatedStudents);
  };

  const deleteStudent = (index: number) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const addStudent = () => {
    const newStudent: Student = { name: "", correct: 0, total: 0 };
    setStudents([...students, newStudent]);
  };

  return (
    <div className="App bg-white w-[100%] min-h-[100vh] flex flex-col px-6 py-4 justify-center items-center">
      <div className="w-full h-[7vh] flex justify-center items-center">
        <button
          className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1"
          onClick={addStudent}
        >
          Pridať študenta
        </button>
      </div>
      <div className="flex flex-wrap w-full h-fit items-center justify-center">
        {students.map((student, index) => (
          <div
            key={index}
            className="relative w-[500px] h-[45vh] m-2 rounded-2xl border-2 border-grey bg-white flex flex-col justify-center items-center"
            style={{
              backgroundColor: getBackgroundColor(
                student.correct,
                student.total
              ),
            }}
          >
            <div className="absolute top-4 right-4 w-[25px] h-[25px] text-grey delete-icon-container">
              <button onClick={() => deleteStudent(index)}>
                <AiOutlineClose style={{ width: "25px", height: "25px" }} />
              </button>
            </div>
            <div className="w-[100%] h-fit justify-center items-center flex flex-col">
              <div className="flex flex-col justify-center items-center">
                <h2 className="mr-4 text-lg font-bold">Meno</h2>
                <div className="flex">
                  <button className="bg-transparent text-transparent border-2 border-transparent rounded-md px-3 py-1 ">
                    -
                  </button>
                  <input
                    type="text"
                    className="border-2 border-grey rounded-md px-2 py-1"
                    placeholder={student.name || `Študent ${index + 1}`}
                    value={student.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                  />
                  <button className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1">
                    ✓
                  </button>
                </div>
              </div>
              <div>
                <h2 className="mr-4 text-lg font-bold ">
                  Počet správnych odpovedí
                </h2>
                <div className="flex">
                  <button
                    className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1"
                    onClick={() =>
                      updateStudentCount(index, "correct", "minus")
                    }
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    className="border-2 border-grey rounded-md px-2 py-1 text-center justify-center items-center flex"
                    value={Math.max(student.correct, 0).toString()}
                  />
                  <button
                    className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1"
                    onClick={() => updateStudentCount(index, "correct", "plus")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <h2 className="mr-4 text-lg font-bold">Počet otázok</h2>
                <div className="flex">
                  <button
                    className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1"
                    onClick={() => updateStudentCount(index, "total", "minus")}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    className="border-2 border-grey rounded-md px-2 py-1 text-center justify-center items-center flex"
                    value={Math.max(student.total, 0).toString()}
                  />
                  <button
                    className="bg-grey text-white border-2 border-grey rounded-md px-3 py-1"
                    onClick={() => updateStudentCount(index, "total", "plus")}
                  >
                    +
                  </button>
                </div>
              </div>
              {student.total > 0 && (
                <div>
                  <h2 className="mr-4 text-lg font-bold">Percentá</h2>
                  <h2 className="mr-4 text-2xl font-bold">
                    {((student.correct / student.total) * 100).toFixed(2)}
                  </h2>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
