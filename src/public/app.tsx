import * as React from "react";
import { connect, Provider } from 'react-redux';
import {
    Route,
    Link,
    BrowserRouter,
    Redirect,
    Switch
} from 'react-router-dom';
import { AlarmClock } from './alarm-clock'
import { TestApp  } from './test'

class Spa extends React.Component {
    props: {
        userData: {
            profile: {
                permission:string;
                email:string;
            }
        }
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        if (this.props.userData.profile.permission === 'guest') {
            return (
                <BrowserRouter>
                    <div className='app-wrapper'>
                        <ul className="app-menu">
                            <a href='/'>
                                <div className='app-menu-title-wrapper'>
                                    <img className='formIcon fadeIn' src='/icons/logo-placeholder.svg' />
                                    <h1 className='app-menu-title'>s.y.l.</h1>
                                </div>
                            </a>

                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/clock-alarm.svg' />
                                <Link to="/app/guest/alarms" className='app-menu-text'>alarms</Link>
                            </li>

                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/squares.svg' />
                                <Link to="/app/guest/orgs" className='app-menu-text '>organizations</Link>
                            </li>

                        </ul>
                        <div className="app-content">
                            <Route path='/app/guest' render={() => <Redirect to='/app/guest/alarms' />} />
                            <Route path='/app/guest/alarms' component={AlarmClock} />
                        </div>
                    </div>
                </BrowserRouter>
            );
        } else if (this.props.userData.profile.permission === 'user') {
            return (
                <BrowserRouter>
                    <div className='app-wrapper'>
                        <ul className="app-menu">
                            <a href='/'>
                                <div className='app-menu-title-wrapper'>
                                    <img className='formIcon fadeIn' src='/icons/logo-placeholder.svg' />
                                    <h1 className='app-menu-title'>s.y.l.</h1>
                                </div>
                            </a>

                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/clock-alarm.svg' />
                                <Link to={"/app/accounts/" + this.props.userData.profile.email + "/alarms"} className='app-menu-text'>alarms</Link>
                            </li>
                            {/* hotfix for working app */}
                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/squares.svg' />
                                <a href="/app/accounts/{{email}}/orgs" className='app-menu-text '>organizations</a>
                            </li>
                            {/* hotfix for working app */}
                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/user-fem.svg' />
                                <a href="/app/accounts/{{email}}" className='app-menu-text'>profile</a>
                            </li>
                            {/* hotfix for working app */}
                            <li className='app-menu-li'>
                                <img className='formIcon fadeIn' src='/icons/white/mixer.svg' />
                                <a href="/app/accounts/{{email}}/settings" className='app-menu-text'>settings</a>
                            </li>
                            {/* hotfix for working app */}
                            <li className='app-menu-li' id='logout'>
                                <div className = "filler"></div>
                                <div className = "logout-wrapper">
                                    <img className='formIcon fadeIn' src='/icons/white/back-1.svg' />
                                    <form action="/log-out" method="post">
                                        <button type="submit" className="app-menu-text">logout</button>
                                    </form>
                                </div>
                                <p className='app-menu-li'>{this.props.userData.profile.permission}</p>
                            </li>
                        </ul>
                        <ul className="mob-app-menu">
                            <li className = 'app-menu-li'>
                                <a href='/'>
                                    <div className='app-menu-title-wrapper'>
                                        <img className='formIcon fadeIn' src='/icons/logo-placeholder.svg' />
                                    </div>
                                </a>
                            </li>

                            <li className='app-menu-li'>
                                
                                <Link to={"/app/accounts/" + this.props.userData.profile.email + "/alarms"} className='app-menu-text'>
                                    <img className='formIcon fadeIn' src='/icons/white/clock-alarm.svg' />
                                </Link>
                                <p className = "mini-text gray-text">alarm</p>
                            </li>
                            <li className='app-menu-li'>
                                
                                <a href="/app/accounts/{{email}}/orgs" className='app-menu-text '>
                                    <img className='formIcon fadeIn' src='/icons/white/squares.svg' />
                                </a>
                                <p className = "mini-text gray-text">orgs</p>
                            </li>
                            <li className='app-menu-li'>
                                
                                <a href="/app/accounts/{{email}}" className='app-menu-text'>
                                    <img className='formIcon fadeIn' src='/icons/white/user-fem.svg' />
                                </a>
                                <p className = "mini-text gray-text">profile</p>
                            </li>
                            <li className='app-menu-li'>
                                
                                <a href="/app/accounts/{{email}}/settings" className='app-menu-text'>
                                    <img className='formIcon fadeIn' src='/icons/white/mixer.svg' />
                                </a>
                                <p className = "mini-text gray-text">settings</p>
                            </li>
                            <li className='app-menu-li' id='logout'>
                                <div className='filler'></div>
                                <div className='logout-wrapper'>
                                    <form action="/log-out" method="post">
                                        <input type='image' name="submit" className='formIcon fadeIn' src='/icons/white/back-1.svg' />
                                    </form>
                                </div>
                                <p className="mini-text gray-text">logout</p>
                            </li>
                        </ul>
                        <div className="app-content">
                            <Route path='/app/account' render={() => <Redirect to={'/app/accounts/' + this.props.userData.profile.email + '/alarms'} />} />
                            <Route path={'/app/accounts/' + this.props.userData.profile.email + '/alarms'} component={AlarmClock} />
                        </div>
                    </div>
                </BrowserRouter>
            );
        } else {
            <h1>something broke</h1>
        }
    }
}

const mapStateToProps = state => {
    return {
        userData: state.userData
    }
}


const App = connect(mapStateToProps)(Spa)

export default App;