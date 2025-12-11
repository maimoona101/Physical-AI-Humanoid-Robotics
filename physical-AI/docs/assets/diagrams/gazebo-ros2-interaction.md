```mermaid
graph TD
    subgraph "ROS 2 System"
        Ros2Control[ROS 2 Control Node] --> CmdVelTopic[/cmd_vel]
        SensorDataTopic[/camera/image_raw] --> Ros2Perception[ROS 2 Perception Node]
        CmdVelTopic --> GazeboRosPlugin[Gazebo ROS 2 Control Plugin]
        GazeboRosPlugin --> GazeboPhysics[Gazebo Physics Engine]
    end

    subgraph "Gazebo Simulation"
        GazeboRobot[Simulated Robot Model] --> GazeboSensors[Simulated Sensors]
        GazeboSensors --> GazeboSensorPlugin[Gazebo ROS 2 Sensor Plugin]
        GazeboSensorPlugin --> SensorDataTopic
        GazeboPhysics --> GazeboRobot
    end

    GazeboControlTopic[/gazebo/model/cmd_vel] --- GazeboRosPlugin

    style Ros2Control fill:#f9f,stroke:#333,stroke-width:2px
    style CmdVelTopic fill:#eee,stroke:#999,stroke-dasharray: 5 5
    style SensorDataTopic fill:#eee,stroke:#999,stroke-dasharray: 5 5
    style Ros2Perception fill:#bbf,stroke:#333,stroke-width:2px
    style GazeboRosPlugin fill:#fcb,stroke:#333,stroke-width:2px
    style GazeboPhysics fill:#cff,stroke:#333,stroke-width:2px
    style GazeboRobot fill:#ccf,stroke:#333,stroke-width:2px
    style GazeboSensors fill:#ffb,stroke:#333,stroke-width:2px
    style GazeboSensorPlugin fill:#bfb,stroke:#333,stroke-width:2px
    style GazeboControlTopic fill:#eee,stroke:#999,stroke-dasharray: 5 5

```