import React from 'react';
import './StatisticsInfo.css';

function StatisticsInfo(props) {
    return (
        <div className="statistics-info">
            <div className="statistics-info-img"></div>
            <div className="statistics-info-text">
                <div className="statistics-info-text-number">{props.number}</div>
                <div className="statistics-info-text-title">{props.text}</div>
            </div>
        </div>
    );
}

export default StatisticsInfo;