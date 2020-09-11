import React from "react";
import "./App.css";

import firebase from "./firebase";
import moment from "moment";
import { Helmet } from "react-helmet";

import { Layout, Button, notification, Table, Tooltip } from "antd";
import { GithubOutlined, BookOutlined } from "@ant-design/icons";
import Loading from "./components/Loading";
import Error from "./components/Error";
import Home from "./components/Home";
import Modal from "antd/lib/modal/Modal";

const { Content, Footer } = Layout;

const saveData = false;
const useSavedData = true;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			home: window.location.pathname.split("/")[1] === "",
			loading: true,
			data: {},
			error: false,
			myTeachers: {
				Home: "",
				BS: "",
				P1: "",
				P2: "",
				P3: "",
				P4: "",
				P5: "",
			},
			myLinks: {
				Home: "#",
				BS: "#",
				P1: "#",
				P2: "#",
				P3: "#",
				P4: "#",
				P5: "#",
			},
			currPeriod: "Home",
			myName: "",
			inital: false,
			randomEmoji: this.randomEmoji(),
		};

		for (let period in this.periodColors) {
			this.periodColors[period] = this.randomBackground();
		}

		this.updateCurrClass = this.updateCurrClass.bind(this);
		this.closeInital = this.closeInital.bind(this);
	}

	// in milli (30 secs)
	updateFreq = 30000;

	//in mins
	timeOffset = 10;

	randomEmojisList = [
		"👋",
		"😆",
		"😎",
		"🤩",
		"🥳",
		"✨",
		"🌟",
		"🚀",
		"😜",
		"😝",
		"🐳",
		"🌊",
		"🔥",
		"🍍",
		"🎯",
		"🏝️",
		"🗿",
		"🗽",
		"🌄",
		"🏜️",
		"🌋",
	];
	randomEmoji = function () {
		return this.randomEmojisList[
			Math.floor(Math.random() * this.randomEmojisList.length)
		];
	};

	randomBackground() {
		//https://codepen.io/chrisgresh/pen/aNjovb

		var hexValues = [
			// "0",
			// "1",
			"2",
			// "3",
			// "4",
			// "5",
			// "6",
			// "7",
			"8",
			"9",
			"a",
			"b",
			// "c",
			"d",
			"e",

			//DOUBLE CHANGE

			"8",
			"9",
			"a",
			"b",
			// "c",
			"d",
			"e",
		];

		function populate(a) {
			for (var i = 0; i < 6; i++) {
				var x = Math.round(Math.random() * (hexValues.length - 1));
				var y = hexValues[x];
				a += y;
			}
			return a;
		}

		var newColor1 = populate("#");
		var newColor2 = populate("#");
		var angle = Math.round(Math.random() * 360);

		var gradient =
			"linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";

		return gradient;
	}

	periodColors = {
		Home: "#fff",
		BS: "#fff",
		P1: "#fff",
		P2: "#fff",
		P3: "#fff",
		P4: "#fff",
		P5: "#fff",
	};

	periodMap = {
		Home: "Advisory/Homeroom",
		BS: "Before School",
		P1: "Period 1",
		P2: "Period 2",
		P3: "Period 3",
		P4: "Period 4",
		P5: "Period 5",
	};

	// TIME MUST BE FORMATTED IN "HH: mm" such as 16:02
	periodTime = {
		Home: {
			Monday: {
				start: "08:30",
				end: "09:00",
			},
			Tuesday: {
				start: "08:30",
				end: "09:00",
			},
			Wednesday: {
				start: "08:30",
				end: "09:00",
			},
			Thursday: {
				start: "08:30",
				end: "09:00",
			},
			Friday: {
				start: null,
				end: null,
			},
		},
		BS: {
			Monday: {
				start: "07:30",
				end: "08:30",
			},
			Tuesday: {
				start: "07:30",
				end: "08:30",
			},
			Wednesday: {
				start: "07:30",
				end: "08:30",
			},
			Thursday: {
				start: "07:30",
				end: "08:30",
			},
			Friday: {
				start: "09:30",
				end: "10:00",
			},
		},
		P1: {
			Monday: {
				start: "09:00",
				end: "10:00",
			},
			Tuesday: {
				start: "09:00",
				end: "10:00",
			},
			Wednesday: {
				start: "09:00",
				end: "10:00",
			},
			Thursday: {
				start: "09:00",
				end: "10:00",
			},
			Friday: {
				start: "10:00",
				end: "10:30",
			},
		},
		P2: {
			Monday: {
				start: "10:00",
				end: "11:00",
			},
			Tuesday: {
				start: "10:00",
				end: "11:00",
			},
			Wednesday: {
				start: "10:00",
				end: "11:00",
			},
			Thursday: {
				start: "10:00",
				end: "11:00",
			},
			Friday: {
				start: "10:30",
				end: "11:00",
			},
		},
		P3: {
			Monday: {
				start: "11:00",
				end: "12:00",
			},
			Tuesday: {
				start: "11:00",
				end: "12:00",
			},
			Wednesday: {
				start: "11:00",
				end: "12:00",
			},
			Thursday: {
				start: "11:00",
				end: "12:00",
			},
			Friday: {
				start: "11:00",
				end: "11:30",
			},
		},
		P4: {
			Monday: {
				start: "13:00",
				end: "14:00",
			},
			Tuesday: {
				start: "13:00",
				end: "14:00",
			},
			Wednesday: {
				start: "13:00",
				end: "14:00",
			},
			Thursday: {
				start: "13:00",
				end: "14:00",
			},
			Friday: {
				start: "13:30",
				end: "14:00",
			},
		},
		P5: {
			Monday: {
				start: "14:00",
				end: "15:00",
			},
			Tuesday: {
				start: "14:00",
				end: "15:00",
			},
			Wednesday: {
				start: "14:00",
				end: "15:00",
			},
			Thursday: {
				start: "14:00",
				end: "15:00",
			},
			Friday: {
				start: "14:00",
				end: "14:30",
			},
		},
	};

	// HH:mm:ss
	offTime = {
		beforeSchool: {
			start: "00:00:00",
			end: "12:00:00",
		},
		lunch: {
			start: "12:00:00",
			end: "13:00:00",
		},
		afterSchool: {
			start: "13:00:00",
			end: "23:59:59",
		},
	};

	componentDidMount() {
		var hazenZoom =
			"https://hazen.rentonschools.us/class-of-2020/links-to-zoom-classrooms";
		var corsAnywhere = "https://cors-anywhere.herokuapp.com/";

		var promise = new Promise((resolve, reject) => {
			if (useSavedData && !saveData) {
				console.log("USING SAVED DATA");
				firebase
					.database()
					.ref("data")
					.once("value", (snapshot) => {
						resolve(snapshot.val());
					});
			} else {
				console.log("GETTING NEW DATA");
				fetch(corsAnywhere + hazenZoom).then((response) => {
					if (response.ok) {
						response.text().then((response) => {
							var parser = new DOMParser();
							var html = parser.parseFromString(response, "text/html");

							var data = {
								teachers: {},
								periods: {
									Home: [],
									BS: [],
									P1: [],
									P2: [],
									P3: [],
									P4: [],
									P5: [],
								},
							};

							var teachersElements = html.querySelectorAll(".fsPanel");
							for (var teacherElement of teachersElements) {
								var name = teacherElement
									.querySelector("h2.fsElementTitle a")
									.innerText.replace(/\//g, " & ")
									.replace(/\./g, "");
								var linkElements = teacherElement.querySelectorAll(
									"div.fsElementContent div.fsContent div.fsElementContent p"
								);
								var links = {
									Home: "#",
									BS: "#",
									P1: "#",
									P2: "#",
									P3: "#",
									P4: "#",
									P5: "#",
								};

								for (var periodElement of linkElements) {
									var link = periodElement.querySelector("a");
									if (link !== null) {
										switch (link.innerText) {
											case this.periodMap.Home:
												links.Home = link.href;
												data.periods.Home.push(name);
												break;
											case this.periodMap.BS:
												links.BS = link.href;
												data.periods.BS.push(name);
												break;
											case this.periodMap.P1:
												links.P1 = link.href;
												data.periods.P1.push(name);
												break;
											case this.periodMap.P2:
												links.P2 = link.href;
												data.periods.P2.push(name);
												break;
											case this.periodMap.P3:
												links.P3 = link.href;
												data.periods.P3.push(name);
												break;
											case this.periodMap.P4:
												links.P4 = link.href;
												data.periods.P4.push(name);
												break;
											case this.periodMap.P5:
												links.P5 = link.href;
												data.periods.P5.push(name);
												break;
											default:
												console.log(
													"UNKNOWN PERIOD FOUND:",
													link.innerText,
													" with ",
													name
												);
												break;
										}
									}
								}
								data.teachers[name] = { name, links };
							}

							if (this.saveData) {
								firebase
									.database()
									.ref("data")
									.set(data)
									.then(() => {
										notification.open({
											type: "success",
											message: "Data has been saved",
										});
									});
							}
							resolve(data);
						});
					} else {
						throw reject("Something went wrong. Try refreshing the page!");
					}
				});
			}
		})
			.then((data) => {
				console.log(data);
				this.setState(
					{ data },
					function () {
						if (this.state.home) {
							this.setState({ loading: false });
						} else {
							firebase
								.database()
								.ref("registrations/" + window.location.pathname.split("/")[1])
								.once(
									"value",
									function (snapshot) {
										if (snapshot.exists()) {
											var myTeachers = snapshot.val();
											var links = {
												Home: "#",
												BS: "#",
												P1: "#",
												P2: "#",
												P3: "#",
												P4: "#",
												P5: "#",
											};

											const nonPeriodFields = ["name"];

											for (let period in myTeachers) {
												if (
													!nonPeriodFields.includes(period) &&
													myTeachers[period] !== ""
												) {
													links[period] = this.state.data.teachers[
														myTeachers[period]
													].links[period];
												}
											}
											this.setState({
												myTeachers,
												loading: false,
												myLinks: links,
												myName: snapshot.val().name,
											});
											console.log(links);

											this.updateCurrClass().then((currPeriod) => {
												if (window.location.pathname.split("/")[2] === "go") {
													if (
														currPeriod !== null &&
														links[currPeriod] !== "#"
													) {
														window.location.href = links[this.state.currPeriod];
													}
												}
											});
											setInterval(this.updateCurrClass, this.updateFreq);

											if (window.location.pathname.split("/")[1] === "demo") {
												this.setState({ inital: true });
											} else {
												firebase
													.database()
													.ref(
														"inital/" + window.location.pathname.split("/")[1]
													)
													.once(
														"value",
														function (snapshot) {
															if (!snapshot.exists()) {
																this.setState({ inital: true });
															}
														}.bind(this)
													);
											}
										} else {
											this.setState({ error: true, loading: false });
										}
									}.bind(this)
								);
						}
					}.bind(this)
				);
			})
			.catch((err) => {
				this.setState({ error: true, loading: false });
				notification.open({
					type: "error",
					message: "Error",
					description: (
						<p>
							Something went wrong. Try refreshing the page!
							<br />
							{err.message}
						</p>
					),
					duration: 0,
				});
			});
	}

	updateCurrClass() {
		return new Promise((resolve, reject) => {
			var dayOfWeek = moment(new Date()).format("dddd");
			for (var period in this.periodTime) {
				var periodDoW = this.periodTime[period][dayOfWeek];
				if (periodDoW.start !== null && periodDoW.end !== null) {
					var start = moment(
						moment(new Date()).format("YYYY-MM-DD") + " " + periodDoW.start,
						"YYYY-MM-DD HH:mm"
					);
					var end = moment(
						moment(new Date()).format("YYYY-MM-DD") + " " + periodDoW.end,
						"YYYY-MM-DD HH:mm"
					);
					var currentDate = moment(new Date()).add(this.timeOffset, "minutes");
					// FOR TESTING ONLY
					// var currentDate = moment("2020-09-03 16:30", "YYYY-MM-DD HH:mm").add(
					// 	this.timeOffset,
					// 	"minutes"
					// );
					if (currentDate.isBetween(start, end)) {
						console.log("CURRENTLY: " + period);
						if (this.state.myLinks[this.state.currPeriod] !== "#") {
							this.setState({ currPeriod: period });
						} else {
							this.setState({ currPeriod: null });
						}
						return resolve(period);
					}
				}
			}

			this.setState({ currPeriod: null });
			resolve(null);
		});
	}

	closeInital() {
		this.setState({ inital: false });
		if (window.location.pathname.split("/")[1] !== "demo") {
			firebase
				.database()
				.ref("inital/" + window.location.pathname.split("/")[1])
				.set(false)
				.catch((err) => {
					console.log(err);
				});
		} else {
			firebase.analytics().logEvent("view_demo", {
				location: "direct",
			});
		}
	}

	quickLinks = [
		{
			title: "Schedule Change (Due Sept. 8th)",
			url:
				"https://hazen.rentonschools.us/counseling/requesting-a-schedule-change-for-1st-trimester",
		},
		{
			title: "Renton Canvas",
			url: "https://rentonschools.instructure.com/",
		},
		{
			title: "Hazen Website",
			url: "https://hazen.rentonschools.us/",
		},
	];

	render() {
		return (
			<Layout
				style={{ minHeight: "100vh" }}
				className={true ? "dark-mode" : "light-mode"}
			>
				<Content
					style={{
						padding: "2vw",
						position: "relative",
					}}
				>
					{this.state.home ? (
						<Home data={this.state.data} loading={this.state.loading} />
					) : (
						<>
							{this.state.loading ? (
								<Loading />
							) : (
								<>
									{!this.state.error ? (
										<>
											<Helmet>
												<title>Hazen Zoom - {this.state.myName}</title>
											</Helmet>
											<div className="user-container">
												<h1 className="user-welcome">
													Welcome
													{this.state.myName !== "" ? (
														<>
															,{" "}
															<span className="name-underline">
																{this.state.myName}
															</span>
														</>
													) : (
														""
													)}
													!
													<span
														className="user-welcomeEmoji"
														role="img"
														aria-label="emoji"
														style={{ cursor: "default", userSelect: "none" }}
														onClick={function () {
															this.setState({
																randomEmoji: this.randomEmoji(),
															});
														}.bind(this)}
													>
														{this.state.randomEmoji}
													</span>
												</h1>
												<div className="user-flex">
													<div className="user-flexSide user-flexLeft">
														<div className="user-leftSection user-upcoming">
															<div className="user-leftSection-titleContainer">
																<h2 className="user-leftSection-title">
																	Upcoming
																</h2>
																<span className="user-leftSection-title-upcomingPeriod">
																	{this.periodMap[this.state.currPeriod]}
																</span>
															</div>
															{this.state.currPeriod === null ? (
																<>
																	{function () {
																		var currDate = moment(new Date());
																		// FOR TESTING ONLY!
																		// var currDate = moment(
																		// 	"2020-09-03 16:30",
																		// 	"YYYY-MM-DD HH:mm"
																		// ).add(this.timeOffset, "minutes");

																		for (let section in this.offTime) {
																			var start = moment(
																				moment(new Date()).format(
																					"YYYY-MM-DD"
																				) +
																					" " +
																					this.offTime[section].start,
																				"YYYY-MM-DD HH:mm:ss"
																			);
																			var end = moment(
																				moment(new Date()).format(
																					"YYYY-MM-DD"
																				) +
																					" " +
																					this.offTime[section].end,
																				"YYYY-MM-DD HH:mm:ss"
																			);

																			if (currDate.isBetween(start, end)) {
																				if (section === "beforeSchool") {
																					return (
																						<>
																							<div className="upcoming-noClass">
																								<img
																									src="begin.svg"
																									draggable={false}
																									alt="Done with classes"
																								/>
																								<p>
																									No classes just yet. Have a
																									great start to your day!
																								</p>
																							</div>
																						</>
																					);
																				} else if (section === "lunch") {
																					return (
																						<>
																							<div className="upcoming-noClass">
																								<img
																									src="lunch.svg"
																									draggable={false}
																									alt="Done with classes"
																								/>
																								<p>
																									Enjoy your lunch!
																									<span
																										role="img"
																										aria-label="plate"
																									>
																										🍽️
																									</span>
																								</p>
																							</div>
																						</>
																					);
																				} else if (section === "afterSchool") {
																					return (
																						<>
																							<div className="upcoming-noClass">
																								<img
																									src="done.svg"
																									draggable={false}
																									alt="Done with classes"
																								/>
																								<p>
																									Yay! You're done with your
																									classes for the day!{" "}
																									<span
																										role="img"
																										aria-label="clap"
																									>
																										👏
																									</span>
																								</p>
																							</div>
																						</>
																					);
																				} else {
																					console.log(
																						"UNKNOWN OFFTIME:",
																						section
																					);
																				}
																			}
																		}
																		return (
																			<>
																				<p>No Classes</p>
																			</>
																		);
																	}.bind(this)()}
																</>
															) : (
																<>
																	<Button
																		type="primary"
																		className="user-joinNowButton"
																		href="#"
																		onClick={function () {
																			firebase
																				.analytics()
																				.logEvent("join_current", {
																					user: window.location.pathname.split(
																						"/"
																					)[1],
																					teacher: this.state.myTeachers[
																						this.state.currPeriod
																					],
																					link: this.state.myLinks[
																						this.state.currPeriod
																					],
																				});
																			window.location.href = this.state.myLinks[
																				this.state.currPeriod
																			];
																		}.bind(this)}
																	>
																		<p>
																			{/* <img src="/zoom.png" alt="Zoom Logo" /> */}
																			Join{" "}
																			{
																				this.state.myTeachers[
																					this.state.currPeriod
																				]
																			}
																			's Zoom
																		</p>
																	</Button>
																</>
															)}
														</div>
														<div className="user-leftSection ">
															<div className="user-leftSection-titleContainer">
																<h2 className="user-leftSection-title">
																	Quick Links
																</h2>
															</div>
															{this.quickLinks.map((link, i) => (
																<p
																	style={{
																		fontSize: "1.1em",
																		marginBottom: "0.25em",
																	}}
																	key={link + i}
																>
																	<a
																		href={link.url}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		{link.title}
																	</a>
																</p>
															))}
														</div>
														<div className="user-leftSection ">
															<div className="user-leftSection-titleContainer">
																<h2 className="user-leftSection-title">
																	Schedule
																</h2>
															</div>
															{function () {
																const columns = [
																	{
																		title: "Period",
																		dataIndex: "period",
																		key: "period",
																	},
																	{
																		title: "Mon-Thurs",
																		dataIndex: "mtTime",
																		key: "mtTime",
																	},
																	{
																		title: "Friday",
																		dataIndex: "fTime",
																		key: "fTime",
																	},
																];

																var dataSource = [];

																for (let period in this.periodTime) {
																	// hard coded monday-thursday
																	var mtStart = moment(
																		moment(new Date()).format("YYYY-MM-DD") +
																			" " +
																			this.periodTime[period].Monday.start,
																		"YYYY-MM-DD HH:mm"
																	);
																	var mtEnd = moment(
																		moment(new Date()).format("YYYY-MM-DD") +
																			" " +
																			this.periodTime[period].Monday.end,
																		"YYYY-MM-DD HH:mm"
																	);
																	var mtTime =
																		mtStart.format("h:mm") +
																		" - " +
																		mtEnd.format("h:mm a");

																	// hard coded friday
																	var fStart = moment(
																		moment(new Date()).format("YYYY-MM-DD") +
																			" " +
																			this.periodTime[period].Friday.start,
																		"YYYY-MM-DD HH:mm"
																	);
																	var fEnd = moment(
																		moment(new Date()).format("YYYY-MM-DD") +
																			" " +
																			this.periodTime[period].Friday.end,
																		"YYYY-MM-DD HH:mm"
																	);
																	var fTime =
																		fStart.format("h:mm") +
																		" - " +
																		fEnd.format("h:mm a");

																	if (
																		this.state.currPeriod !== null &&
																		period === this.state.currPeriod
																	) {
																		dataSource.push({
																			key: period,
																			mtTime: <strong>{mtTime}</strong>,
																			fTime: <strong>{fTime}</strong>,
																			period: (
																				<strong>
																					{this.periodMap[period]}
																				</strong>
																			),
																		});
																	} else {
																		dataSource.push({
																			key: period,
																			mtTime,
																			fTime,
																			period: this.periodMap[period],
																		});
																	}
																}

																return (
																	<Table
																		columns={columns}
																		dataSource={dataSource}
																		pagination={{
																			total: dataSource.length,
																			pageSize: dataSource.length,
																			hideOnSinglePage: true,
																		}}
																		scroll={{ x: 575 }}
																	/>
																);
															}.bind(this)()}
														</div>
														{/* <div className="user-leftSection ">
															<div className="user-leftSection-titleContainer">
																<h2 className="user-leftSection-title">
																	Clubs
																</h2>
															</div>
															Hazen FBLA: obvi the best
														</div> */}
													</div>

													<div className="user-flexSide user-flexRight">
														{Object.keys(this.state.myLinks).map((key) => (
															<>
																{this.state.myLinks[key] === "#" ? (
																	<></>
																) : (
																	<>
																		<div
																			key={key}
																			className="user-classItem"
																			style={{
																				background: this.periodColors[key],
																			}}
																			onClick={() => {
																				firebase
																					.analytics()
																					.logEvent("join_button", {
																						user: window.location.pathname.split(
																							"/"
																						)[1],
																						teacher: this.state.myTeachers[key],
																						link: this.state.myLinks[key],
																					});
																				window.location.href = this.state.myLinks[
																					key
																				];
																			}}
																		>
																			<h3>
																				<strong>{this.periodMap[key]}</strong>
																			</h3>
																			<p style={{ fontWeight: "600" }}>
																				Join {this.state.myTeachers[key]}'s Zoom
																			</p>
																		</div>
																	</>
																)}
															</>
														))}
													</div>
												</div>
											</div>
											<Modal
												title={null}
												visible={this.state.inital}
												footer={
													<Button type="primary" onClick={this.closeInital}>
														Sounds good!
													</Button>
												}
												onCancel={this.closeInital}
											>
												<h1>
													<span role="img" aria-label="wave">
														👋
													</span>{" "}
													Hey!
												</h1>
												<p>
													Here's a quick overview of the features this dashboard
													offers:
												</p>
												<ul>
													<li>
														Your next class will be listed under{" "}
														<code>Upcoming</code> on the top left.
													</li>
													<li>
														If you visit{" "}
														<a
															href={
																window.location.protocol +
																"//" +
																window.location.hostname +
																(window.location.port
																	? ":" + window.location.port
																	: "") +
																"/" +
																window.location.pathname.split("/")[1] +
																"/" +
																"go"
															}
														>
															<code>
																{window.location.protocol +
																	"//" +
																	window.location.hostname +
																	(window.location.port
																		? ":" + window.location.port
																		: "") +
																	"/" +
																	window.location.pathname.split("/")[1] +
																	"/" +
																	"go"}
															</code>
														</a>
														, you will be automatically redirected to your
														upcoming class's zoom link!
													</li>
													<li>
														You can access all of your zoom links on the right
														side.
													</li>
													<li>The schedule can be seen on the bottom left.</li>
												</ul>
												<br />
												<p>
													Last but not least, don't forget to{" "}
													<a
														href="#"
														onClick={function () {
															notification.open({
																icon: <BookOutlined />,
																message: (
																	<p>
																		Press{" "}
																		<code>
																			{(navigator.userAgent
																				.toLowerCase()
																				.indexOf("mac") !== -1
																				? "Command/Cmd"
																				: "CTRL") + " + D"}
																		</code>{" "}
																		to bookmark this page.
																	</p>
																),
																duration: 10,
															});
														}}
													>
														<strong>Bookmark</strong>
													</a>{" "}
													this page so you always have easy access to your zoom
													links!
												</p>
											</Modal>
										</>
									) : (
										<Error />
									)}
									<div className="FAB">
										<Tooltip
											placement="left"
											title="Visit Hazen High School's Website"
										>
											<a
												href="https://hazen.rentonschools.us/class-of-2020/links-to-zoom-classrooms"
												draggable={false}
												onClick={function () {
													firebase.analytics().logEvent("visit_hazen", {
														user: window.location.pathname.split("/")[1],
													});
												}}
											>
												<img
													src="/HazenLogo.png"
													alt="Hazen High School Logo"
												/>
											</a>
										</Tooltip>
									</div>
								</>
							)}
						</>
					)}
				</Content>
				<Footer style={{ textAlign: "center" }}>
					<a
						className="gh-link"
						href="https://github.com/garytou2/Hazen-Zoom"
						onClick={function () {
							firebase.analytics().logEvent("visit_github_repo", {
								user: window.location.pathname.split("/")[1],
							});
						}}
					>
						Hazen Zoom <GithubOutlined />
					</a>
					<span className="credit-sep">|</span>
					Developed by{" "}
					<a
						href="https://garytou.com"
						onClick={function () {
							firebase.analytics().logEvent("visit_garytou_com", {
								user: window.location.pathname.split("/")[1],
							});
						}}
					>
						Gary Tou
					</a>
				</Footer>
			</Layout>
		);
	}
}

export default App;
