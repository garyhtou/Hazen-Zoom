import React from "react";
import { Spin } from "antd";
import { Helmet } from "react-helmet";
import "./Error.css";

import firebase from "./../firebase";

class Error extends React.Component {
	constructor() {
		super();

		firebase.analytics().logEvent("error_page", {
			url: window.location.pathname.split("/")[1],
		});
	}

	render() {
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
				<Helmet>
					<title>Hazen Zoom - 404</title>
				</Helmet>
				<div className="error-flex">
					<div>
						<h1 style={{ fontSize: "4em" }}>Whoops!</h1>
						<div style={{ fontSize: "1.1em" }}>
							<p>
								<code>{window.location.pathname.split("/")[1]}</code> doesn't
								exists.
							</p>
							<p style={{ fontStyle: "italic" }}>
								Want to claim this username? <a href="/">Visit home</a>
							</p>
						</div>
					</div>
					<img
						src="404.svg"
						alt="Not Found"
						style={{ width: "30vw", marginLeft: "10vw" }}
					/>
				</div>
			</div>
		);
	}
}

export default Error;
