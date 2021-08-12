import React, {useState} from 'react'
import classes from './contactus.module.css'
import MainLayout from '../components/MainLayout'
import isMobile, {success} from '../components/Helpers'
import ContactUsMobile from "../componentsMobile/ContactUsMobile/ContactUsMobile";
import axios from "axios";
import FormBuilder from '../components/FormBuilder'
import {useRouter} from "next/router";
import {useSelector, useDispatch} from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import {disableLoading, enableLoading} from "../../store/actions/commonAction";
import {constants} from "../../constants";
import {decode} from "html-entities";
import Head from "next/head";

function ContactUs({data}) {

    const dispatch = useDispatch()
    const router = useRouter();
    const [inputs, setInputs] = useState([])
    const [errors, setErrors] = useState([])

    const form = JSON.parse(data.form.structure)
    const loading = useSelector(store => store.common.loading)
    const sendForm = async (e) => {
        if(loading){
            return;
        }
        e.preventDefault()
        dispatch(enableLoading())
        const response = await axios.post(`${constants.ENDPOINT}/api/add-form`,
            {
                "form_id": data.form.id,
                "name": inputs.name,
                "phone": inputs.phone,
                "email": inputs.email,
                "service_type": inputs.service_type,
                "message": inputs.message
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'lang': router.locale
                }
            }
        ).then(() => {
            dispatch(disableLoading())

            setInputs([])
            setErrors([])
            success('Uğurla göndərildi')

        }).catch((error) => {
            setErrors(error.response.data)
            dispatch(disableLoading())
        })
    }

    const mobile_check = isMobile()
    return (
        <MainLayout translations={data.common}>
            <Head>
                <title>{decode(data.common.translation.title)} - {decode(data.common.translation.profile_contact_us)}</title>
            </Head>
            {!mobile_check ?
                <div className={classes.container}>
                    <iframe className={classes.map} frameBorder="0" scrolling="no"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5607.534110473702!2d49.820412004038396!3d40.38203367090463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d96d3010bff%3A0x57b708899b0d617f!2s53%20Inshaatchilar%20avenue%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1618560386893!5m2!1sen!2s"/>

                    <div className={classes.wrapper}>
                        <div className={classes.contact}>
                            <h3>{decode(data.common.translation.contact_us_form_title)}</h3>
                            <div className={classes.formWrapper}>
                                <form onSubmit={sendForm} className={classes.form}>
                                    <FormBuilder errors={errors} inputs={inputs} setInputs={setInputs} data={form}/>
                                    {loading ? <div style={{width:100}} className={classes.loadingWrapper}><LoadingSpinner small/></div> :
                                        <button type={"submit"} className={classes.submitBTN}>{decode(data.common.translation.common_send)}</button>}
                                </form>
                            </div>
                        </div>
                        <div className={classes.partner}>
                            <h3>{decode(data.common.translation.contact_us_title)}</h3>
                            <div className={classes.partnerWrapper}>
                                <div dangerouslySetInnerHTML={{__html: decode(data.common.translation.contact_us_text)}}
                                     className={classes.partnerText}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <ContactUsMobile translations={data.common.translation} sendForm={sendForm} errors={errors} setErrors={setErrors} inputs={inputs}
                                 setInputs={setInputs} data={form} />}
        </MainLayout>
    )
}

export async function getServerSideProps(context) {

    const response = await axios.post(`${constants.ENDPOINT}/api/contact-us`, {}, {
        headers: {
            'lang': context.locale
        }
    })

    return {
        props: {
            data: response.data,
            statusCode: response.status
        }
    }
}

export default ContactUs
