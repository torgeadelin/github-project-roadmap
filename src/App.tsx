import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";

import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: "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",
});

function App() {
  const [milestones, setMilestones] = useState([]);

  const createGanttData = useCallback((result: any) => {
    return result.data.map((item: any) => {
      return {
        url: item.url,
        end: new Date(item.due_on),
        start: new Date(item.created_at),
        name: item.title,
        id: item.id,
        type: "task",
        styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
        progress:
          item.open_issues + item.closed_issues === 0
            ? 0
            : Math.floor(
                (item.closed_issues / (item.open_issues + item.closed_issues)) *
                  100
              ),
      };
    });
  }, []);

  useEffect(() => {
    octokit
      .request("GET /repos/{owner}/{repo}/milestones", {
        owner: "momentum-design",
        repo: "momentum-design",
      })
      .then((result) => {
        console.log(result);
        setMilestones(createGanttData(result));
      });

    return () => {};
  }, []);

  return (
    <div className="App">
      <h1>@momentum-design Roadmap</h1>
      <a
        href="https://github.com/momentum-design/momentum-design/milestones"
        target="_blank"
      >
        Milestones on Git
      </a>
      <div
        style={{
          marginTop: '2rem',
          background: "white",
          color: "black",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        {milestones.length !== 0 ? (
          <Gantt
            todayColor="#fffa99aa"
            tasks={milestones}
            viewMode={ViewMode.Week}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
