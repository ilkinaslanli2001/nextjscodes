import React from 'react'
import classes from './aboutus.module.css'
import MainLayout from "../components/MainLayout";
import Accordions from "../components/Accordions/Accordions";
import axios from 'axios'
import Error from "../_error";
import {constants} from "../../constants";
import Head from "next/head";
import {decode} from "html-entities";

function AboutUs({data, statusCode}) {
    return <MainLayout translations={data.common}>
        <Head>
            <title>{decode(data.common.translation.title)} - {data.page.title}</title>
        </Head>
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <h3>{data.page.title}</h3>
                <div dangerouslySetInnerHTML={{__html: data.page.text}} className={classes.text}/>
                <Accordions data={data.page.accordion.fields}/>
            </div>
        </div>
    </MainLayout>
}

export async function getServerSideProps(context) {

    const response = await axios.post(`${constants.ENDPOINT}/api/page/haqqimizda`, {}, {
        headers: {
            'lang': context.locale
        }
    })
    return {
        props: {
            data: response.data,
            statusCode: response.status
        },
    }
}

export default AboutUs
