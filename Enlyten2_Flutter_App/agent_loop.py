import time
import subprocess
from pathlib import Path

TASK_FILE = Path("Project_Task_Master.md")

def read_tasks():
    return TASK_FILE.read_text(encoding="utf-8")

def extract_next_task(content):
    for line in content.splitlines():
        if line.strip().startswith("- [ ]"):
            return line.replace("- [ ]", "").strip()
    return None

def mark_done(task):
    content = read_tasks()
    updated = content.replace(f"- [ ] {task}", f"- [x] {task}")
    TASK_FILE.write_text(updated, encoding="utf-8")

def execute_task(task):
    print(f"\n🚀 Executing: {task}\n")

    prompt = f"""
    You are a coding agent.

    Task:
    {task}

    Execute it step by step.
    If code is needed, generate it.
    If file changes are needed, describe them clearly.
    """

    result = subprocess.run(
        ["ollama", "run", "deepseek-coder:6.7b"],
        input=prompt,
        text=True,
        capture_output=True
    )

    print(result.stdout)
    return result.stdout

def main():
    while True:
        content = read_tasks()
        task = extract_next_task(content)

        if not task:
            print("✅ All tasks completed")
            break

        output = execute_task(task)

        # بسيط: نعتبره نجح
        mark_done(task)

        time.sleep(2)

if __name__ == "__main__":
    main()