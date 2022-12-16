import React from 'react';
import './App.css';
import data from './data.txt';

var answered = []; // contains numbers of answers that have been guessed by the player
var strikes = ""; // contains player strikes

// class for answer boxes
class Square extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			number: parseInt(this.props.number),
			answer: this.props.answer,
			points: parseInt(this.props.points),
		};
	}
	
	render()
	{
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>
				{ answered.includes(this.state.number) ? (
					<div className="square border border-3 border-dark">
						<p>{this.state.answer.toUpperCase()}</p>
					</div>
				) : strikes.length >= 5? (
					<div className="square unanswered border border-3 border-dark">
						<p>{this.state.answer.toUpperCase()}</p>
					</div>
				) : (
					<div className="square border border-3 border-dark">
						<p></p>
					</div>
				)}
			</div>
		);
	}
}

// class for box containing point values for each answer
class PointBox extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			number: this.props.number,
			points: this.props.points,
		};
	}
	
	render()
	{
		const points = this.state.points;
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>
				{ answered.includes(this.state.number) ? (
					<div className="point-box border border-3 border-dark">
						<p>{points}</p>
					</div>
				) : strikes.length >= 5 ? (
					<div className="point-box unanswered border border-3 border-dark">
						<p>{points}</p>
					</div>
				) : (
					<div className="point-box border border-3 border-dark">
						<p></p>
					</div>
				)}
			</div>
		);
	}
}

// class for the numbered covers on each answer
class Cover extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			number: parseInt(this.props.number),
		};
	}
	
	render()
	{
		const number = this.state.number;
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>
				{ number === -1 ? (
					<div className="cover">
						<p></p>
					</div>
				) : answered.includes(number) || strikes.length >= 5 ? (
					<div className="cover slide-cover">
						<p>{number}</p>
					</div>
				) : (
					<div className="cover">
						<p>{number}</p>
					</div>
				)}
			</div>
		);
	}
}

// class for the animated strikes
class StrikeBox extends React.Component
{
	render()
	{
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>
				{ strikes.length === 1 ? (
					<div className="strikes s1">
						<p>X</p>
					</div>
				) : strikes.length === 2 ? (
					<div className="strikes s2">
						<p>XX</p>
					</div>
				) : strikes.length === 3 ? (
					<div className="strikes s3">
						<p>XXX</p>
					</div>
				) : strikes.length === 4 ? (
					<div className="strikes s4">
						<p>XXXX</p>
					</div>
				) : strikes.length === 5 ? (
					<div className="strikes s5">
						<p>XXXXX</p>
					</div>
				) : (
					<div>
					</div>
				)}
			</div>
		);
	}
}

class App extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			question: "",
			answers: "",
			accepted: "",
			pointVals: "",
			score: 0,
			updated: false,
		}
	}
	
	// get text input from file
	handleText = () => {
        fetch(data)
		.then((r)=>r.text())
		.then(text => {
			var lines = text.split('\r\n');
			var filtered = lines.filter(function(value, index, lines){
				return value !== "";
			});
			
			var answers = [];
			var accepted = [];
			var pointVals = [];
			
			for(let i = 1; i < filtered.length; i+=3)
			{
				answers.push(filtered[i]);
				accepted.push(filtered[i+1]);
				pointVals.push(filtered[i+2]);
			}
			
			this.setState({question: filtered[0], answers, accepted, pointVals});
		})
    }
	
	// when player presses enter while typing in the input box, they have submitted their answer
	keyPress = (event) =>
	{
		if(event.key === "Enter")
		{
			this.submitAnswer();
		}
	}
	
	// when player submits their answer, check if it matches any accepted answer
	submitAnswer()
	{
		// if the answer in the .txt file ends in an asterisk *, check
		// if the player's answer matches exactly
		// otherwise, check if any of the accepted answers are a
		// substring of the player's answer
		const ans = document.getElementById("questionInput").value.toLowerCase();
		const acceptedAnswers = this.state.accepted;
		var correct = false;
		
		for(let i = 0; i < acceptedAnswers.length; i++)
		{
			let accepted = acceptedAnswers[i].split(",");
			for(let j = 0; j < accepted.length; j++)
			{
				let current = accepted[j].trim().toLowerCase();
				if(current.endsWith('*') && current.slice(0,-1) === ans && !answered.includes(i+1))
				{
					answered.push(i+1);
					this.setState({score: this.state.score + parseInt(this.state.pointVals[i])});
					correct = true;
					break;
				}
				else if(ans.includes(current) && !answered.includes(i+1))
				{
					answered.push(i+1);
					this.setState({score: this.state.score + parseInt(this.state.pointVals[i])});
					correct = true;
					break;
				}
			}
		}
		if(correct === false)
		{
			strikes += "X";
		}
		
		document.getElementById("questionInput").value = "";
		
		this.forceUpdate();
	}
	
	render()
	{
		// make sure we have stored the data from the text file
		if(this.state.pointVals === "")
		{
			this.handleText();
		}
		
		const question = this.state.question;
		const answers = this.state.answers;
		const pointVals = this.state.pointVals;
		const numRows = Math.ceil(answers.length/2);
		const rowVals = [];
		const ansVals = [];
		for(let i = 0; i < answers.length; i++)
		{
			if(i < numRows)
			{
				if(i+numRows < answers.length)
				{
					rowVals.push([i, i+numRows]);
				}
				else
				{
					rowVals.push([i, -1]);
				}
			}
			ansVals.push(i);
		}
		
		return (
			<div className="App">
				<StrikeBox/>
				<header className="App-header">
					<p className="title">FEUD</p>
				</header>
				<div className="center">
					<div className="question-box border border-3 border-dark">
						<p>{question.toUpperCase()}</p>
					</div><br/>
					<div className="score-box inline">
						<p>{this.state.score}</p>
					</div>
					
					<div className="input-area">
					{ strikes.length < 5 ? (
						<div>
							<input id="questionInput" className="questionInput form-control inline" type="text" onKeyPress={this.keyPress}></input>
							<button id="submitButton" className="btn btn-secondary submit-button inline" onClick={() => this.submitAnswer()}>Submit</button>
						</div>
					) : (
						<div></div>
					)}
					</div>
					<div className="answers ans-lg">
						{ rowVals.map(ansnums => (
							<div key={ansnums[0]}>
								<div className="ansrow">
									<div className="inline">
										<Cover number={ansnums[0]+1}/>
										<Square
											number={ansnums[0]+1}
											answer={answers[ansnums[0]]}
										/>
										<PointBox
											number={ansnums[0]+1}
											points={pointVals[ansnums[0]]}
										/>
									</div>
									{ ansnums[1] !== -1 ? (
										<div className="inline">
											<Cover number={ansnums[1]+1}/>
											<Square
												number={ansnums[1]+1}
												answer={answers[ansnums[1]]}
											/>
											<PointBox
												number={ansnums[1]+1}
												points={pointVals[ansnums[1]]}
											/>
										</div>
									) : (
										<div className="inline">
											<Cover number={ansnums[1]}/>
											<Square
												number={ansnums[1]}
												answer=""
											/>
											<PointBox
												number={ansnums[1]}
												points={ansnums[1]}
											/>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
					<div className="answers ans-sm">
						{ ansVals.map(ansnum => (
							<div key={ansnum}>
								<div className="inline">
									<Cover number={ansnum+1}/>
									<Square
										number={ansnum+1}
										answer={answers[ansnum]}
									/>
									<PointBox
										number={ansnum+1}
										points={pointVals[ansnum]}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
				<br/>
			</div>
		);
	}
}

export default App;
