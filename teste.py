{
  "Comment": "Orquestração de Glue Jobs com Step Functions",
  "StartAt": "ParallelJobs",
  "States": {
    "ParallelJobs": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "Job1",
          "States": {
            "Job1": {
              "Type": "Task",
              "Resource": "arn:aws:states:::glue:startJobRun.sync",
              "Parameters": {
                "JobName": "NomeDoJob1"
              },
              "End": true
            }
          }
        },
        {
          "StartAt": "Job2",
          "States": {
            "Job2": {
              "Type": "Task",
              "Resource": "arn:aws:states:::glue:startJobRun.sync",
              "Parameters": {
                "JobName": "NomeDoJob2"
              },
              "End": true
            }
          }
        },
        {
          "StartAt": "Job3",
          "States": {
            "Job3": {
              "Type": "Task",
              "Resource": "arn:aws:states:::glue:startJobRun.sync",
              "Parameters": {
                "JobName": "NomeDoJob3"
              },
              "End": true
            }
          }
        }
      ],
      "Next": "Job4",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "SendEmailJob"
        }
      ]
    },
    "Job4": {
      "Type": "Task",
      "Resource": "arn:aws:states:::glue:startJobRun.sync",
      "Parameters": {
        "JobName": "NomeDoJob4"
      },
      "End": true
    },
    "SendEmailJob": {
      "Type": "Task",
      "Resource": "arn:aws:states:::glue:startJobRun.sync",
      "Parameters": {
        "JobName": "NomeDoJobEmail"
      },
      "End": true
    }
  }
}
