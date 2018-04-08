import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { populate } from './actions/user-data'


const Test = ({userData, populate}) => {
    console.log('~~~~~~~~~~~~~~~~~~~~ 7. test component', userData, populate)
    return (
        <div>
            <p>THIS IS A TEST TO SEE IF STATE CAN COME FROM REDUX</p>    
            <div><pre>{JSON.stringify(userData, null, 2) }</pre></div>
            <button onClick = {populate} className = 'button dark-button'>get user data</button>
        </div>
    )
}

const mapStateToProps = state => {
console.log(' ~~~~~~~~~~~~~~~~~~~~ 4. map state to prop', state)
    return {
        userData: state.userData
    }
}

const mapDispatchToProps = dispatch => {
    console.log('~~~~~~~~~~~~~~~~~~~~ 6. map dispatch', populate)
    return {
        populate: (userData) => dispatch(populate(userData))
    }
}

const TestApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(Test)



export { TestApp };



// class Tester extends React.Component {
//     user: any;
//     props: any;
    

//     constructor(props) {
//         super(props)

//         this.user = this.props.userData
//     }
//     render() {
//         console.log(this.props)
//         return(
//             <div>
//                 <p>this is a test that originates fasdg;lkajndkg a little sauce</p>
//                 <div><pre>{JSON.stringify(this.user, null, 2) }</pre></div>
//             </div>
//         )
//     }
// }
// <div><pre>{JSON.stringify({userData}, null, 2)}</pre></div>