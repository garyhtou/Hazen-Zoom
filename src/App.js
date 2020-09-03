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
		};

		for (let period in this.periodColors) {
			this.periodColors[period] = this.randomBackground();
		}

		this.updateCurrClass = this.updateCurrClass.bind(this);
	}

	// in milli (30 secs)
	updateFreq = 30000;

	//in mins
	timeOffset = 10;

	randomEmojisList = ["👋", "😆", "😎", "🤩", "🥳"];
	randomEmoji = this.randomEmojisList[
		Math.floor(Math.random() * this.randomEmojisList.length)
	];

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

		fetch(corsAnywhere + hazenZoom)
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error("Something went wrong. Try refreshing the page!");
				}
			})
			.then((response) => {
				var parser = new DOMParser();
				var html = parser.parseFromString(response, "text/html");

				var data = {
					teachers: {},
					periods: { Home: [], BS: [], P1: [], P2: [], P3: [], P4: [], P5: [] },
				};

				var teachersElements = html.querySelectorAll(".fsPanel");
				for (var teacherElement of teachersElements) {
					var name = teacherElement.querySelector("h2.fsElementTitle a")
						.innerText;
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
								case this.periodMap.P4:
									links.P4 = link.href;
									data.periods.P5.push(name);
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
					description: <p>Something went wrong. Try refreshing the page!</p>,
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
					// var currentDate = moment("2020-09-02 10:30", "YYYY-MM-DD HH:mm").add(
					// 	this.timeOffset,
					// 	"minutes"
					// );
					if (currentDate.isBetween(start, end)) {
						console.log("CURRENTLY: " + period);
						this.setState({ currPeriod: period });
						return resolve(period);
					}
				}
			}

			this.setState({ currPeriod: null });
			resolve(null);
		});
	}

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
												<title>
													Hazen Zoom - {window.location.pathname.split("/")[1]}
												</title>
											</Helmet>
											<div className="user-container">
												<h1 className="user-welcome">
													Welcome
													{this.state.myName !== ""
														? ", " + this.state.myName
														: ""}
													!
													<span className="user-welcomeEmoji">
														{this.randomEmoji}
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
																							<p>Have a great day!</p>
																						</>
																					);
																				} else if (section === "lunch") {
																					return (
																						<>
																							<p>Enjoy your lunch!🍽️</p>
																						</>
																					);
																				} else if (section === "afterSchool") {
																					return (
																						<>
																							<p>
																								Yay! You're done with your
																								classes for the day.
																							</p>
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
																<Button
																	type="primary"
																	className="user-joinNowButton"
																	href={
																		this.state.myLinks[this.state.currPeriod]
																	}
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
															)}
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
																				window.location.href = this.state.myLinks[
																					key
																				];
																			}}
																		>
																			<h3>
																				<strong>{this.periodMap[key]}</strong>
																			</h3>
																			<p>
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
													<Button
														type="primary"
														onClick={function () {
															this.setState({ inital: false });
															if (
																window.location.pathname.split("/")[1] !==
																"demo"
															) {
																firebase
																	.database()
																	.ref(
																		"inital/" +
																			window.location.pathname.split("/")[1]
																	)
																	.set(false)
																	.catch((err) => {
																		console.log(err);
																	});
															}
														}.bind(this)}
													>
														Sounds good!
													</Button>
												}
											>
												<h1>👋 Hey!</h1>
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
														, you will be automatically redirect to your next
														class's zoom link!
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
																				.indexOf("mac") != -1
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
					<a className="gh-link" href="https://github.com/garytou2/Hazen-Zoom">
						Hazen Zoom <GithubOutlined />
					</a>
					<span className="credit-sep">|</span>
					Developed by <a href="https://garytou.com">Gary Tou</a>
				</Footer>
			</Layout>
		);
	}
}

export default App;
