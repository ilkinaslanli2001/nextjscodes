import React from 'react'
import classes from './info.module.css'
import MainLayout from '../../components/MainLayout'
import axios from "axios";
import Error from "../../_error"
import {constants} from "../../../constants";
import {decode} from "html-entities";
import Head from "next/head";

function Info({data, statusCode}) {
    return statusCode === 200 ? <MainLayout translations={data.common}>
        <Head>
            <title>{decode(data.common.translation.title)} - {decode(data.info_box.title)}</title>
        </Head>
        <div className={classes.infoPage}>
            <div className={classes.box}>
                <h1 className={classes.boxTitle}>{data.info_box.title}</h1>
                <div dangerouslySetInnerHTML={{__html: data.info_box.description}} className={classes.boxDescription}/>
                <div className={classes.boxWrapper}>
                    {data.info_box.details.map((box, key) => {
                        return <div key={key} className={classes.card}>
                            <img alt={box.title} src={box.icon ? box.icon : '/media/images/no-picture.png'}/>
                            <h3>{box.title}</h3>
                            <div className={classes.cardDescription} dangerouslySetInnerHTML={{__html: box.text}}/>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </MainLayout> : <Error statusCode={statusCode}/>
}

export async function getServerSideProps(context) {
    let error = []
    const response = await axios.post(`${constants.ENDPOINT}/api/infobox/${context.query.slug}`, {
        headers: {
            'lang': context.locale
        }
    }).catch((data) => {
        error = data
    })
    return error.length === 0 ? {
        props: {
            data: response.data,
            statusCode: response.status
        }
    } : {
        props: {
            data: {},
            statusCode: error.response.status
        }
    }
}

export default Info
