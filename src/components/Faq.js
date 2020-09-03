import React from "react";
import { Spin } from "antd";
import { Helmet } from "react-helmet";

function Error() {
	const faq = [
		{
			question: "My schedule has changed, how do I update my dashboard?",
			answer:
				"Just simply create a new dashboard using the form on the left. Unfortunately, you will need to choose a new URL.",
		},
		{
			question: "Can teachers use this dashboard too?",
			answer: "Yeah! Just select yourself for all the periods you teach.",
		},
		{
			question: "Is there a demo?",
			answer: (
				<a
					href={
						window.location.protocol +
						"//" +
						window.location.hostname +
						(window.location.port ? ":" + window.location.port : "") +
						"/demo"
					}
				>
					Visit demo dashboard
				</a>
			),
		},
		{
			question: "Is there an even easier way to get the zoom link I need?",
			answer: (
				<p>
					Of course! Once you create a dashboard, you can add <code>/go</code>{" "}
					to the end of your Custom URL and it will take your directly to the
					current period's zoom link.
				</p>
			),
		},
		{
			question: "How does this website get the zoom links?",
			answer: (
				<p>
					It web scapes{" "}
					<a href="https://hazen.rentonschools.us/class-of-2020/links-to-zoom-classrooms">
						Hazen's website
					</a>{" "}
					everytime your visit the website. This means you will always have the
					most updated link!
				</p>
			),
		},
		{
			question: "I found a bug!",
			answer: (
				<p>
					Send me an email at{" "}
					<a href="mailto:garytou2@gmail.com" className="home-email">
						garytou2@gmail.com
					</a>{" "}
					or if you're familiar with GitHub, feel free to create an{" "}
					<a href="https://github.com/garytou2/Hazen-Zoom">Issue/PR</a>.
				</p>
			),
		},
	];

	return (
		<>
			<h3 style={{ fontSize: "1.5em" }}>FAQ</h3>
			{faq.map((faq) => (
				<div style={{ marginBottom: "1em" }}>
					<p style={{ marginBottom: "0" }}>
						<strong>{faq.question}</strong>
					</p>
					<p>{faq.answer}</p>
				</div>
			))}
		</>
	);
}
export default Error;
