## Overview

![Chatbot Demo](./logo.svg)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![npm version](https://img.shields.io/badge/npm-v1.0.5-green)](https://www.npmjs.com/package/chatbot-widget-ui)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

**NPM Package Link:**
[ermis-chat-widget-sdk](https://www.npmjs.com/package/ermis-chat-widget-sdk)

**ermis-chat-widget-sdk** is a library for creating React.js, built using
TypeScript.

**Demo:** [ermis-chat-widget](https://widget-demo.ermis.network)

**Features**:

- Implemented using React.js and TypeScript for robustness and type safety.
- Provides a customizable user interface for integrating chatbot functionality
  into web applications.
- Offers various configuration options to tailor the chatbot widget's appearance
  and behavior.

## Usage

1. Install the latest version:

```bash
npm install ermis-chat-widget-sdk@latest
```

```bash
yarn add ermis-chat-widget-sdk@latest
```

2. Import the library:

```javascript
import { ErmisChatWidget } from 'ermis-chat-widget-sdk';
```

3. Use the `ErmisChatWidget` component:

```javascript
<ErmisChatWidget
  apiKey="YOUR_API_KEY"
  openWidget={openWidget}
  onToggleWidget={onToggleWidget}
  token="YOUR_TOKEN"
  senderId="YOUR_WALLET_ADDRESS"
  receiverId="RECEIVER_WALLET_ADDRESS" // optional
  primaryColor="#eb4034" // optional
  placement={{ top: 'auto', left: 'auto', right: '30px', bottom: '30px' }} // optional
/>
```

### Usage Example

```javascript
import React from 'react';
import { ErmisChatWidget } from 'ermis-chat-widget-sdk';

const App = () => {
  const [open, setOpen] = useState(false);

  const onToggleWidget = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ErmisChatWidget
        apiKey="YOUR_API_KEY"
        openWidget={open}
        onToggleWidget={onToggleWidget}
        token="YOUR_TOKEN"
        senderId="YOUR_WALLET_ADDRESS"
        receiverId="RECEIVER_WALLET_ADDRESS" // optional
        primaryColor="#eb4034" // optional
        placement={{ top: 'auto', left: 'auto', right: '30px', bottom: '30px' }} // optional
      />
    </div>
  );
};

export default App;
```

## Component Props

| Prop Name        | Type     | Default Value                                                             | Description                                                                                                                                                      |
| ---------------- | -------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`         | string   |                                                                           | Your API key for authenticating the chat widget.                                                                                                                 |
| `openWidget`     | boolean  | `false`                                                                   | Boolean value to control whether the widget is open (true) or closed (false) on initial load.                                                                    |
| `onToggleWidget` | function | `-`                                                                       | Callback function that triggers when the widget is toggled. Receives a boolean argument indicating the widget's current state (true for open, false for closed). |
| `token`          | string   | `-`                                                                       | Authentication token for the user, ensuring secure communication.                                                                                                |
| `senderId`       | string   | `-`                                                                       | Unique identifier for the message sender.                                                                                                                        |
| `receiverId`     | string   | `-` (optional)                                                            | Unique identifier for the message receiver.                                                                                                                      |
| `primaryColor`   | string   | `"#eb4034"` (optional)                                                    | The primary color used for styling elements like headers, buttons, and backgrounds.                                                                              |
| `placement`      | object   | `{ top: "auto", left: "auto", right: "30px", bottom: "30px" }` (optional) | Placement of popup widget                                                                                                                                        |
