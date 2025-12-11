```mermaid
graph TD
    subgraph "Unity Simulation"
        UnityScene[Unity Scene] --> UnityRobot[Unity Robot Model]
        UnityRobot --> UnitySensors[Simulated Sensors]
        UnityRobot --> UnityActuators[Simulated Actuators]
        UnitySensors --> TCPSender[TCP Sender (ROS-Sharp)]
        TCPReceiver[TCP Receiver (ROS-Sharp)] --> UnityActuators
    end

    subgraph "ROS 2 System"
        Ros2Control[ROS 2 Control Node] --> ROS2Publisher[ROS 2 Publisher (e.g., /cmd_vel)]
        ROSSubscriber[ROS 2 Subscriber (e.g., /sensor_data)] --> Ros2Perception[ROS 2 Perception Node]
    end

    TCPSender -- TCP/IP --> ROSSubscriber
    ROS2Publisher -- TCP/IP --> TCPReceiver

    style UnityScene fill:#c2e0c6,stroke:#333,stroke-width:2px
    style UnityRobot fill:#a3d9b0,stroke:#333,stroke-width:2px
    style UnitySensors fill:#d4edda,stroke:#333,stroke-width:2px
    style UnityActuators fill:#d4edda,stroke:#333,stroke-width:2px
    style TCPSender fill:#fdfd96,stroke:#333,stroke-width:2px
    style TCPReceiver fill:#fdfd96,stroke:#333,stroke-width:2px
    style Ros2Control fill:#f9f,stroke:#333,stroke-width:2px
    style ROS2Publisher fill:#eee,stroke:#999,stroke-dasharray: 5 5
    style ROSSubscriber fill:#eee,stroke:#999,stroke-dasharray: 5 5
    style Ros2Perception fill:#bbf,stroke:#333,stroke-width:2px
```