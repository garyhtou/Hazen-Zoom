import React from "react";
import { Form, Input, Button, Select, notification, Tooltip } from "antd";
import "./Home.css";
import Typist from "react-typist";
import firebase from "./../firebase";
import Filter from "bad-words";
import Faq from "./Faq";

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			typing: true,
			reg: {},
			loading: true,
			submit: false,
			regValues: {},
		};
	}

	componentDidMount() {
		this.regListener = firebase
			.database()
			.ref("registrations")
			.on(
				"value",
				function (snapshot) {
					this.setState({ reg: snapshot.val(), loading: false });
				}.bind(this)
			);
	}

	componentWillUnmount() {
		this.regListener && this.regListener();
		this.regListener = undefined;
	}

	doneTyping = () => {
		this.setState({ typing: false }, () => {
			this.setState({ typing: true });
		});
	};

	forTypist = ["gary", "yourName", "serena", "andy", "wowie", "stunning"];

	render() {
		return (
			<>
				<div className="home">
					<div className="home-titleContainer">
						<h1 className="home-title">Hazen Zoom</h1>
						<h3>
							Hate scrolling through the Hazen's website to find your Zoom
							links?
							<br />
							Get your own personalized dashboard. Let's go!
						</h3>
					</div>
					<div className="home-regSection">
						<div className="home-regContainer">
							{!this.state.submit ? (
								<>
									<div className="home-regMessage">
										<h3 className="home-regTitle">Create your dashboard</h3>
										<p>
											Reserve your custom URL.{" "}
											<code>
												/
												{this.state.typing ? (
													<Typist
														className="typist"
														onTypingDone={this.doneTyping}
														avgTypingDelay={100}
														cursor={{
															show: true,
															blink: true,
															element: "|",
															hideWhenDone: true,
															hideWhenDoneDelay: 1000,
														}}
													>
														{this.forTypist.map((value) => (
															<span key={value}>
																<span>{value}</span>
																<Typist.Delay ms={1000} />
																<Typist.Backspace
																	count={value.length}
																	delay={200}
																/>
																<Typist.Delay ms={200} />
															</span>
														))}
													</Typist>
												) : (
													<></>
												)}
											</code>
										</p>
									</div>
									<Form
										layout="vertical"
										hideRequiredMark
										onFinish={function (values) {
											console.log(values);
											firebase.analytics().logEvent("register_submit", {
												name: values.name.trim(),
												url: values.url.trim(),
												BS: values.BS,
												Home: values.Home,
												P1: values.P1,
												P2: values.P2,
												P3: values.P3,
												P4: values.P4,
												P5: values.P5,
											});

											var error = false;
											if (values.name.trim().length > 50) {
												notification.open({
													type: "error",
													message: "Name is too long!",
												});
												error = true;
											}
											if (values.url.trim().length > 30) {
												notification.open({
													type: "error",
													message: "URL is too long!",
												});
												error = true;
											}
											if (values.url.trim() === "") {
												notification.open({
													type: "error",
													message: "Silly! You can take the home url",
												});
												error = true;
											} else if (!values.url.trim().match("^[A-Za-z0-9]+$")) {
												notification.open({
													type: "error",
													message: "URL contains invalid characters!",
													description:
														"Only letters and numbers are allowed (A-Z, a-z, 0-9)",
												});
												error = true;
											}

											const periods = [
												"BS",
												"Home",
												"P1",
												"P2",
												"P3",
												"P4",
												"P5",
											];
											var chosen1 = false;
											for (let period of periods) {
												console.log(period, values[period]);
												if (
													values[period] !== "" &&
													!this.props.data.periods[period].includes(
														values[period]
													)
												) {
													notification.open({
														type: "error",
														message:
															values[period] +
															" doesn't have a " +
															period +
															"!",
													});
													error = true;
												} else if (
													values[period] !== "" &&
													this.props.data.periods[period].includes(
														values[period]
													)
												) {
													chosen1 = true;
												}
											}
											if (!chosen1) {
												notification.open({
													type: "error",
													message:
														"Huh?! Don't you at least have one class? 🤡",
												});
												error = true;
											}

											var filter = new Filter();
											if (
												filter.isProfane(values.name.trim()) ||
												filter.isProfane(values.url.trim())
											) {
												console.log(filter.clean(values.name.trim()));
												console.log(filter.clean(values.url.trim()));
												notification.open({
													type: "error",
													message: "Woah!",
													description: "Maybe try some different words :)",
												});
												error = true;
											}

											if (!error) {
												firebase
													.database()
													.ref("registrations/" + values.url.trim())
													.once(
														"value",
														function (snapshot) {
															if (snapshot.exists()) {
																notification.open({
																	type: "error",
																	message: "URL is taken!",
																});
															} else {
																const regValues = {
																	name: values.name.trim(),
																	url: values.url.trim(),
																	BS: values.BS,
																	Home: values.Home,
																	P1: values.P1,
																	P2: values.P2,
																	P3: values.P3,
																	P4: values.P4,
																	P5: values.P5,
																};

																const fbValues = {
																	name: values.name.trim(),
																	BS: values.BS,
																	Home: values.Home,
																	P1: values.P1,
																	P2: values.P2,
																	P3: values.P3,
																	P4: values.P4,
																	P5: values.P5,
																};

																firebase
																	.database()
																	.ref("registrations/" + values.url.trim())
																	.set(fbValues)
																	.then(
																		function () {
																			this.setState({
																				regValues,
																				submit: true,
																			});
																		}.bind(this)
																	)
																	.catch(function (error) {
																		notification.open({
																			type: "error",
																			message: "Un Oh!",
																			description: error.toString(),
																		});
																	});

																firebase
																	.analytics()
																	.logEvent("register_success", regValues);
															}
														}.bind(this)
													);
											}
										}.bind(this)}
									>
										<Form.Item
											required
											label="Your Name"
											name="name"
											help={this.state.nameHelp}
											validateStatus={this.state.nameStatus}
											hasFeedback={true}
											initialValue=""
										>
											<Input
												placeholder="Gordy the Highlander"
												onChange={function (change) {
													var value = change.target.value.trim();
													if (value.length > 50) {
														this.setState({
															nameHelp: "Name is too long",
															nameStatus: "error",
														});
													} else {
														this.setState({
															nameHelp: null,
															nameStatus: null,
														});
													}
												}.bind(this)}
											/>
										</Form.Item>
										<Form.Item
											required
											label="Your Custom URL"
											help={this.state.urlHelp}
											validateStatus={this.state.urlStatus}
											hasFeedback={true}
											name="url"
											initialValue=""
										>
											<Input
												placeholder="gordy"
												addonBefore={
													window.location.protocol +
													"//" +
													window.location.hostname +
													(window.location.port
														? ":" + window.location.port
														: "") +
													"/"
												}
												onChange={function (change) {
													var value = change.target.value.trim();
													if (value === "") {
														this.setState({
															urlHelp: null,
															urlStatus: null,
														});
													} else if (value.length > 30) {
														this.setState({
															urlHelp: "URL is too long!",
															urlStatus: "error",
														});
													} else {
														if (!this.state.loading) {
															if (
																typeof this.state.reg[value] === "undefined"
															) {
																this.setState({
																	urlHelp: null,
																	urlStatus: "success",
																});
															} else {
																this.setState({
																	urlHelp: "URL taken",
																	urlStatus: "error",
																});
															}
														}
													}
												}.bind(this)}
											/>
										</Form.Item>
										<br />
										<Form.Item label="Zero Period" name="BS" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.BS.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item
											label="Homeroom/Advisory"
											name="Home"
											initialValue=""
										>
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.Home.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item label="First Period" name="P1" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.P1.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item label="Second Period" name="P2" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.P2.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item label="Third Period" name="P3" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.P3.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item label="Fourth Period" name="P4" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.P4.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item label="Fifth Period" name="P5" initialValue="">
											<Select showSearch>
												<Select.Option value="">None</Select.Option>
												{!this.props.loading ? (
													<>
														{this.props.data.periods.P5.map((value) => (
															<Select.Option value={value} key={value}>
																{value}
															</Select.Option>
														))}
													</>
												) : (
													<></>
												)}
											</Select>
										</Form.Item>
										<Form.Item>
											<Button
												type="primary"
												htmlType="submit"
												style={{ backgroundColor: "#304EFA" }}
											>
												Create!
											</Button>
										</Form.Item>
									</Form>
								</>
							) : (
								<div className="home-regMessage">
									<h3 className="home-regTitle">
										Congrats {this.state.regValues.name}!
									</h3>
									<p>
										You now have your own easy and simply way access your zoom
										links!
										<br />
										<code>
											<a
												href={
													window.location.protocol +
													"//" +
													window.location.hostname +
													(window.location.port
														? ":" + window.location.port
														: "") +
													"/" +
													this.state.regValues.url
												}
											>
												{window.location.protocol +
													"//" +
													window.location.hostname +
													(window.location.port
														? ":" + window.location.port
														: "") +
													"/" +
													this.state.regValues.url}
											</a>
										</code>
									</p>
									<Button
										href={
											window.location.protocol +
											"//" +
											window.location.hostname +
											(window.location.port ? ":" + window.location.port : "") +
											"/" +
											this.state.regValues.url
										}
										style={{
											backgroundColor: "#304EFA",
											color: "white",
											marginTop: "1em",
										}}
									>
										Visit my dashboard!
									</Button>
								</div>
							)}
						</div>
						<div className="home-regImages">
							<div className="home-example home-rightSection">
								<a
									href={
										window.location.protocol +
										"//" +
										window.location.hostname +
										(window.location.port ? ":" + window.location.port : "") +
										"/" +
										"demo"
									}
									target="_blank"
									rel="noopener noreferrer"
									onClick={function () {
										firebase.analytics().logEvent("to_demo", {
											location: "home_example",
										});
									}}
								>
									<Tooltip title="This could be your dashboard!">
										<img
											src="example.jpg"
											alt="Dashboard Example"
											className="home-images"
										/>
									</Tooltip>
								</a>
							</div>
							<div className="home-rightSection">
								<div style={{ width: "fit-content" }}>
									<img
										src="videocall.svg"
										alt="Video Call"
										className="home-images"
									/>
									<p
										style={{
											textAlign: "center",
											marginTop: "5px",
											fontStyle: "italic",
										}}
									>
										Make your pre-zoom call expereince more enjoyable
									</p>
								</div>
							</div>
							<div className="home-rightSection">
								<Faq />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Home;
