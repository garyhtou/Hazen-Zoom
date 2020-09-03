import React from "react";
import { Spin } from "antd";

function Loading() {
	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				textAlign: "center",
			}}
		>
			<Spin size="large" />
		</div>
	);
}

export default Loading;
